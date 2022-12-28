console.log("js add view");
const socketClient = io();

const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const product = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value,
    }

    socketClient.emit("newProduct", product);
});

const productsContainer = document.getElementById("productsContainer");

socketClient.on("productsArray", async(data)=>{
    console.log(data)
    const templateTable = await fetch("./templates/table.handlebars");
    const templateFormat = await templateTable.text();
    const template = Handlebars.compile(templateFormat);
    //gereamos html con template y datos de productos
    const html = template({products:data});
    productsContainer.innerHTML = html;
})