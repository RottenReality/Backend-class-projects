console.log("js funcionando");

const socketClient2 = io();

const chatContainer = document.getElementById("chatContainer");

//Denormalizacion
const authorSchema = new normalizr.schema.Entity("authors",{},{idAttribute:"id"});
const messageSchema = new normalizr.schema.Entity("messages",
    {
        autor: authorSchema
    }
);

const chatSchema = new normalizr.schema.Entity("chats", {
    messages:[messageSchema]
});

const normalizarData = (data)=>{
    const dataNormalizada = normalize({id:"chatHistory", messages:data}, chatSchema);
    return dataNormalizada;
}


socketClient2.on("messagesChat", async (data)=>{
    console.log("data normalizada: ",JSON.stringify(data, null, "\t").length);
    dataMsg = normalizr.denormalize(data.result, chatSchema, data.entities);
    console.log("data normal: ",JSON.stringify(dataMsg, null, "\t").length);
    console.log("porcentaje:", norma/denorma);
    let messages = "";
    dataMsg.messages.forEach(element => {
         messages += `<p><b style="color:blue"> ${element.author.id}</b> [<font color="red">${element.date}</font>]: <i style="color:green">${element.text}</i> </p>`
     });
     chatContainer.innerHTML = messages;
})

let user;

Swal.fire({
    title: 'Perfil formulario',
    html: `<input type="email" id="email" class="swal2-input" placeholder="Correo">
    <input type="text" id="age" class="swal2-input" placeholder="Edad">
    <input type="text" id="name" class="swal2-input" placeholder="Nombre">
    <input type="text" id="apellido" class="swal2-input" placeholder="Apellido">
    <input type="text" id="alias" class="swal2-input" placeholder="Alias">
    <input type="text" id="avatarUrl" class="swal2-input" placeholder="Url de avatar">`,
    confirmButtonText: 'confirmar',
    focusConfirm: false,
    preConfirm: () => {
      const id = Swal.getPopup().querySelector('#email').value
      const edad = Swal.getPopup().querySelector('#age').value
      const nombre = Swal.getPopup().querySelector('#name').value
      const apellido = Swal.getPopup().querySelector('#apellido').value
      const alias = Swal.getPopup().querySelector('#alias').value
      const avatar = Swal.getPopup().querySelector('#avatarUrl').value
      if (!id || !edad || !nombre || !apellido || !alias || !avatar) {
        Swal.showValidationMessage(`Porfavor completar todos los datos`)
      }
      return { id, edad, nombre, apellido, alias, avatar }
    },
    allowOutsideClick: false,
  }).then((result) => {
    Swal.fire(`
      id: ${result.value.id}
      edad: ${result.value.edad}
      nombre: ${result.value.nombre}
      apellido: ${result.value.apellido}
      alias: ${result.value.alias}
      avatar: ${result.value.avatar}
    `.trim())

    user = result.value;
    document.getElementById("username").innerHTML = `Bienvenido ${user.id}`;
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
        // id:user,
        // nombre: document.getElementById("nombre").value,
        // apellido: document.getElementById("apellido").value,
        // edad:document.getElementById("edad").value,
        // alias:document.getElementById("alias").value,
        // avatar:document.getElementById("avatar").value,
        author:user,
        date: fecha + " " + hora,
        text:document.getElementById("messageChat").value
    }

    socketClient2.emit("newMsg", message);
    document.getElementById("messageChat").value = "";
    
})