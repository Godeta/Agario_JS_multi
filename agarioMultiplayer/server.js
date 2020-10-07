//création du serveur web
var express = require('express');
var app = express();
const port = process.env.PORT || 3000; //il récupère le port sois dans la variable d'environnement, sois prend 3000
var server = app.listen(port);
app.use(express.static('public'));

console.log("my socket server is running");

//interaction client
var socket = require('socket.io');
var io = socket(server);
//event lorsqu'il y a une nouvelle connection
io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log(socket.id);
    socket.on('mouse', mouseMsg);
    //envoie les données à tous les clients
    function mouseMsg(data) {
        socket.broadcast.emit('mouse', data);
        console.log(data);
    }
}