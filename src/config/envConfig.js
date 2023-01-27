const dotenv = require("dotenv");
dotenv.config();

const envConfig={
    DB: process.env.DB
};


module.exports = {envConfig};