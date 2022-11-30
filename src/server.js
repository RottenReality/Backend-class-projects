const fs = require("fs");
const express = require('express');
const { Router } = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const contenedorProds = require('./ej');
const loc = require('./chatLogs');
const {Server} = require("socket.io")
const {options} = require("./config/dataBaseConfig");
const {contenedorSQL} = require('./managers/contenedorSQL');

const viewsFolder = path.join(__dirname, "views");

const app = express();

PORT = 8080;

app.use(express.static(__dirname+"/public"));

app.use(express.json());
app.use(express.urlencoded({extended: true}))

const server = app.listen(PORT, ()=>console.log(`Server listening on ${PORT}`));

//let ob = new contenedorProds.Contenedor()
const productoApi = new contenedorSQL(options.mariaDB, "productos");
const chatApi = new contenedorSQL(options.sqliteDB, "chat");
//let lc = new loc.chatInfo("./chatLogs.txt")

const routerProductos = Router();

app.engine("handlebars", handlebars.engine());

app.set("views", viewsFolder);
app.set("view engine", "handlebars");

const io = new Server(server);


io.on("connection", async(socket)=>{
    console.log("Nuevo cliente conectado")
    //envio de productos cada vez que el socket se conecte
    socket.emit("productsArray", await productoApi.getAll())

    //socket.emit("messagesChat", await messages);

    //recibir producto
    socket.on("newProduct", async(data)=>{
        await productoApi.save(data);
        //enviar todos los productos actualizados
        io.sockets.emit("productsArray", await productoApi.getAll());
        
    })

    socket.on("newMsg", async(data)=>{
        //await chatApi.save(data);
        await chatApi.save(data);
        const messages = await chatApi.getAll();
        io.sockets.emit("messagesChat", await messages);
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

app.use('/productos', routerProductos);