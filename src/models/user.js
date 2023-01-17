const mongoose = require('mongoose');

const userCollection ="users";

const userSchema = new mongoose.Schema({
    username:String,
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
});

const UserModel = mongoose.model(userCollection, userSchema);

module.exports = {UserModel};

