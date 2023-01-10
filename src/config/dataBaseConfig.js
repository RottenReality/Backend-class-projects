const path = require('path');

const options = {
    mariaDB:{
        client: "mysql",
        connection:{
            host: "127.0.0.1",
            user: "root",
            password: "",
            database: "coderhousedb"
        }
    },
    sqliteDB:{
        client: "sqlite",
        connection:{
            filename:path.join(__dirname, "../DB/chatdb.sqlite")  
        },
        useNullAdDefault:true
    },
    mongoAtlasSessions:{
        urlDatabase:"mongodb+srv://rottenreality:BgkBxsB9PWTvBNoW@coderbackend.oorljea.mongodb.net/sessionsDB?retryWrites=true&w=majority"
    }
}

module.exports = {options};