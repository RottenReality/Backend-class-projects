const {randomNums} = require('./src/routes/web/randomRouter')

process.send("listo");

process.on("message", (parentMsg)=>{
    console.log(parentMsg)
    const resultado = randomNums(parentMsg);
    process.send(resultado);

})