'use strict'
const mongoose = require('mongoose');
const _SECOND = 5000;
const os = require('os');
const process = require('process');
//check connect
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log("🚀 ~ newConnection:", numConnection)
}

//check over load
const checkOverLoad = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsed = process.memoryUsage().rss;
        //Example: Maximum number of connection based on number osf cores
        const maxConnections = numCores * 5;

        console.log(`Active connections: ${numConnection}`)
        console.log(`Memory usage: ${memoryUsed / 1024 / 1014} MB`)

        if(numConnection > maxConnections) {
            console.log("Connection overload detected!")
        }
    }, _SECOND) //Monitor every 5 seconds
}

module.exports = {
    countConnect,
    checkOverLoad,
}