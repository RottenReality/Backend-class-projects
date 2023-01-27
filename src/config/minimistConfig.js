const parseArgs = require('minimist');

const argumentos = parseArgs(process.argv.slice(2))

const puerto = argumentos._[0];

module.exports = {puerto};