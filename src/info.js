
const data = {
    platform: process.platform,
    nodeVersion:process.version,
    memoryUsage: process.memoryUsage.rss(),
    execPath:process.execPath,
    pid:process.pid,
    directory:process.cwd()
    
}

module.exports = {data};