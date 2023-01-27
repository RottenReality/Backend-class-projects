const express = require('express');
const {fork} = require('child_process');

const randomRouter = express.Router();

function randomNums(query){
    const numbers = []
    const elementCounts = {};

    for (let i = 0; i < query; i++) {
        let randomNumber = Math.floor(Math.random() * 1000 + 1);
        numbers.push(randomNumber);
    }

    numbers.forEach(element => {
        elementCounts[element] = (elementCounts[element] || 0) + 1;
    });

    return elementCounts;
}

randomRouter.get("/randoms",(req,res)=>{

    let query = 100000000;
    if(req.query.cant){query = req.query.cant};

    const child = fork("child.js")
    child.on("message",(childMsg=>{
        if(childMsg == "listo"){
            child.send(query);
        } else{
            res.json(childMsg);
        }
    }))


    
});

    



module.exports = {randomRouter, randomNums};