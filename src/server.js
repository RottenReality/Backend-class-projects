const express = require('express');
const { Router } = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const {Server} = require("socket.io")
const {options} = require("./config/dataBaseConfig");
const {contenedorSQL} = require('./managers/contenedorSQL');
const {Contenedor} = require('./managers/contenedorProductos');
const {ContenedorChat} = require('./managers/contenedorChats');
const {normalize, schema} = require('normalizr');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const MongoStore = require('connect-mongo');
const {authRouter} = require('./routes/web/authRouter')
const passport = require('passport');
const { mongoose } = require('mongoose');
const LocalStrategy = {Strategy} = require('passport-local');
const {UserModel} = require('./models/user') 
const {prRouter} = require('./routes/web/prRouter')
const {randomRouter} = require('./routes/web/randomRouter')

//conexion base de datos
const URLDB = "mongodb+srv://rottenreality:BgkBxsB9PWTvBNoW@coderbackend.oorljea.mongodb.net/coderDB?retryWrites=true&w=majority";

mongoose.connect(URLDB, {
    useNewUrlParser:true,
    useUnifiedTopology: true
}, (error)=>{
    if(error) console.log("conexion fallida");
    console.log("base de datos conectada correctamente")
});


const viewsFolder = path.join(__dirname, "views");

const app = express();

PORT = 8080;

app.use(express.static(__dirname+"/public"));

app.use(express.json());
app.use(express.urlencoded({extended: true}))

const server = app.listen(PORT, ()=>console.log(`Server listening on ${PORT}`));


const productoApi = new contenedorSQL(options.mariaDB, "productos");
const chatApi = new contenedorSQL(options.sqliteDB, "chat");

const msManager = new ContenedorChat("./src/files/chatLogs.txt");
const prManager = new Contenedor("./src/files/products.txt");


const routerProductos = Router();
const routerTest = Router();

app.engine("handlebars", handlebars.engine());
app.set("views", viewsFolder);
app.set("view engine", "handlebars");


app.use(cookieParser());

app.use(session({
    store:MongoStore.create({
        mongoUrl:options.mongoAtlasSessions.urlDatabase,
        ttl: 600
    }),
    secret:"claveSecreta",
    resave:false,
    saveUninitialized:false
}));

//vinculacion de passport con el servidor
app.use(passport.initialize());//inicializacion de passport
app.use(passport.session());


//config serializar y deserializar


app.use(prRouter);
app.use('/api',randomRouter);
//app.use(authRouter);

const io = new Server(server);


io.on("connection", async(socket)=>{
    console.log("Nuevo cliente conectado")
    //envio de productos cada vez que el socket se conecte
    socket.emit("productsArray", await productoApi.getAll())


    //recibir producto
    socket.on("newProduct", async(data)=>{
        await productoApi.save(data);
        //enviar todos los productos actualizados
        io.sockets.emit("productsArray", await productoApi.getAll());
        
    })

    io.sockets.emit("messagesChat", await normalizarMensajes());

    socket.on("newMsg", async(data)=>{
        //console.log(data)
        await msManager.save(data);
        io.sockets.emit("messagesChat", await normalizarMensajes());
    })
})

passport.serializeUser((user, done)=>{
    return done(null, user.id)
});
passport.deserializeUser((id,done)=>{
    UserModel.findById(id,(error,userFound)=>{
        return done(error,userFound)
    })
});

app.get("/registro",(req,res)=>{
    res.render("signup")
});

app.get("/profile",(req,res)=>{
    res.render("profile");
});

app.get("/",(req, res)=>{
    if(req.session.username){
        res.render("add",{name:req.session.username}); 
    } else {
        res.redirect("/login");
    }
})

routerProductos.get("/",async (req, res)=>{
    const listProductos = await productoApi.getAll();
    if(listProductos == "No hay productos"){
        res.render("vacio", {
            mensaje: listProductos
        })
    }else {
        res.render("list", {
            productos: listProductos
        })
    }
})

routerProductos.post("/",(req, res)=>{
    let productoNuevo = req.body;
    let productoAgregado = productoApi.save(productoNuevo);
    res.redirect("/");
})

//------------------------------------------
routerTest.get("/",async (req,res)=>{
    for(let i =0 ; i < 6; i++){
            await prManager.save5();
    }
    res.send("generados");
})

routerTest.get("/productos-test",async (req,res)=>{
    const randomProds = await prManager.getAll();
    if(randomProds == "error en lectura de productos"){
        res.render("vacio", {
            mensaje: randomProds
        })
    }else {
        res.render("list", {
            productos: randomProds
        })
    }
})



app.use('/productos', routerProductos);
app.use('/api', routerTest);

//-----------------normalizacion--------------

const authorSchema = new schema.Entity("authors",{},{idAttribute:"id"});
const messageSchema = new schema.Entity("messages",
    {
        autor: authorSchema
    }
);

//const chat = {
//    id:"chatHistory",
//    messages: []
//}

const chatSchema = new schema.Entity("chats", {
    messages:[messageSchema]
});

const normalizarData = (data)=>{
    const dataNormalizada = normalize({id:"chatHistory", messages:data}, chatSchema);
    return dataNormalizada;
}

const normalizarMensajes = async()=>{
    const messages = await msManager.getAll();
    const normalizedMessages = normalizarData(messages);
    return normalizedMessages;
}


//----------------------------------------estrategia de registro de usuarios-------------------------------
passport.use("signupStrategy", new LocalStrategy(
    {
        passReqToCallBack:true,
        usernameField:"email"
    },
    (req, username, password, done)=>{
        UserModel.findOne({email:username},(err,userFound)=>{
            if(err) return done(err);
            if(userFound) return done(null, false, {message:"El usuario ya existe"})
            else{
                const newUser = {
                    email:username,
                    password:password
            }
            
            UserModel.create(newUser, (err, userCreated)=>{
                if(err) return done(err,null,{message:"Error al crear el usuario"})
                else{
                    return done(null,userCreated);
                }
                
            })
        
        };
            // const newUser = {
            //     username:req.body.username,
            //     email:username,
            //     password:password
            // };
            // UserModel.create(newUser, (err, userCreated)=>{
            //     if(err) return done(err,null,{message:"Error al crear el usuario"})
            //     return done(null,userCreated)
            // })
        })
    }
))

app.post("/signup",passport.authenticate("signupStrategy",{
    failureRedirect:"/errorSignUp",
    failureMessage: true
}),
(req,res)=>{
    console.log(req.body);
    res.redirect("/profile")
});

app.post("/login",(req,res)=>{
    // const {email, password} = req.body;
    // //validamos si eciste el usuario
    // const userFound = users.find(elm=>elm.email === email);
    // if(userFound){
    //     //verificar la contraseña
    //     if(userFound.password === password){
    //         req.session.user = req.body;
    //         res.render("profile")
    //     } else{
    //         res.render("login",{error:"contraseña invalida"});
    //     }
    // } else{
    //     res.render("login", {error:"El usuario no existe, crea una cuenta"});
    // }

    const {name} = req.body;
    req.session.username = name;
    console.log(req.session);
    res.redirect("/");
});

app.get("/logout",(req,res)=>{
    const name = req.session.username;
    req.session.destroy(err=>{
        if(err) return res.redirect("/home");
        res.render("logout", {name: name})
    })
});