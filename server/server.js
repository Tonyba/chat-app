const express = require('express');
const app = express();
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 3000;

// IO = este es el backend
app.use(express.static(publicPath));
module.exports.io = socketIO(server);
require('../sockets/socket');



server.listen(port, (err) => {
    if (err) throw new Error(err);

    console.log('server on port ' + port);
});