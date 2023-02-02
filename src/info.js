const os = require('os');

const data = {
    platform: process.platform,
    nodeVersion:process.version,
    memoryUsage: process.memoryUsage.rss(),
    execPath:process.execPath,
    pid:process.pid,
    directory:process.cwd(),
    numberOfCores:os.cpus().length
    
}

module.exports = {data};