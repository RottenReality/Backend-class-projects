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

app.get("/",(req, res)=>{
    res.render("add");
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

