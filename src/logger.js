const winston = require('winston');
const {transports} = require('winston');

const logger = winston.createLogger({
    transports:[
        new transports.Console({level:"info"}),
        new transports.File({filename:"/src/logs/warn.log", level:"warn"}),
        new transports.File({filename:"/src/logs/error.log", level:"error"})
    ]
});

module.exports = {logger};