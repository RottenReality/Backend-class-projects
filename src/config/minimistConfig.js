const parseArgs = require('minimist');

const argumentos = parseArgs(process.argv.slice(2))

const puerto = argumentos._[0];

const modo = argumentos._[1] || "FORK";

module.exports = {puerto, modo};