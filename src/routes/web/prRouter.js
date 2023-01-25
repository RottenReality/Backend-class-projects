const express = require('express');
const {data} = require('../../info')

const prRouter = express.Router();

prRouter.get("/info",(req,res)=>{
    res.render("info", {data})
});

module.exports = {prRouter};