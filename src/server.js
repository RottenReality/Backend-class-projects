const express = require('express');
const { Router } = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const cla = require('./ej');
const {Server} = require("socket.io")

const viewsFolder = path.join(__dirname, "views");

const app = express();

PORT = 8080;

app.use(express.static(__dirname+"/public"));

app.use(express.json());
app.use(express.urlencoded({extended: true}))

const server = app.listen(PORT, ()=>console.log(`Server listening on ${PORT}`));

let ob = new cla.Contenedor()

const routerProductos = Router();

app.engine("handlebars", handlebars.engine());

app.set("views", viewsFolder);
app.set("view engine", "handlebars");

const io = new Server(server);

const messages = [
    { author: "Juan@gmail.com", date: "17/11/22 12:25:32", text: "¡Hola! ¿Que tal?" },
    { author: "Pedro@outlook.com", date: "17/11/22 12:26:10", text: "¡Muy bien! ¿Y vos?" },
    { author: "Ana@yahoo.com", date: "17/11/22 12:26:25", text: "¡Genial!" }
];


io.on("connection", async(socket)=>{
    console.log("Nuevo cliente conectado")
    //envio de productos cada vez que el socket se conecte
    socket.emit("productsArray", await ob.getAll())

    socket.emit("messagesChat", messages);

    //recibir producto
    socket.on("newProduct", async(data)=>{
        await ob.save(data);
        //enviar todos los productos actualizados
        io.sockets.emit("productsArray", await ob.getAll());
        
    })

    socket.on("newMsg", (data)=>{
        messages.push(data);
        io.sockets.emit("messagesChat", messages);
    })
})

app.get("/",(req, res)=>{
    res.render("add");
})

routerProductos.get("/",(req, res)=>{
    const listProductos = ob.getAll();
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
    let productoAgregado = ob.save(productoNuevo);
    res.redirect("/");
})

app.use('/productos', routerProductos);