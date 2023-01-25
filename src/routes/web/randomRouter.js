const express = require('express');

const randomRouter = express.Router();

randomRouter.get("/random",(req,res)=>{
    let query = req.query.cant;

    const numbers = []
    for (let i = 0; i < query; i++) {
        let randomNumber = Math.floor(Math.random() * 1000);
        numbers.push(randomNumber);
    }
    res.send(numbers)
});



module.exports = {randomRouter};