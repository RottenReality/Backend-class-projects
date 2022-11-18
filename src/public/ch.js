console.log("js funcionando");

const socketClient2 = io();

const chatContainer = document.getElementById("chatContainer");


socketClient2.on("messagesChat", async (data)=>{
    console.log(data)
    let messages = "";
    data.forEach(element => {
        messages += `<p><b style="color:blue"> ${element.author}</b> [<font color="red">${element.date}</font>]: <i style="color:green">${element.text}</i> </p>`
    });
    chatContainer.innerHTML = messages;
})

let user = ""
Swal.fire({
    title: "Bienvenido",
    text: "Ingresa tu correo:",
    input: "text",
    allowOutsideClick: false
}).then(response=>{
    console.log(response)
    user = response.value;
    document.getElementById("username").innerHTML = `Bienvenido ${user}`;
})

const chatForm = document.getElementById("chatForm");

let date = new Date();
let fecha = date.getDate()+ "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
let hora = date.getHours() + ":" + date.getMinutes();

chatForm.addEventListener("submit", (event)=>{
    //prevenir recarga de pagina al enviar formulario
    event.preventDefault();
    console.log("formulario enviado")
    const message = {
        author:user,
        date: fecha + " " + hora,
        text:document.getElementById("messageChat").value
    }

    socketClient2.emit("newMsg", message);
    
})