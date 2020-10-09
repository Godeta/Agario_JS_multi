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
//en cas de deconnection
io.sockets.on("disconnect", disconnection);

//boucle qui envoie les données de chaque clients à tout le monde
setInterval(heartbeat, 1000);

function heartbeat() {
    io.sockets.emit('heartbeat',clients);
}

//un tableau pour chaque client qui se connecte au serveur
var clients = [];

function Blob(id, x, y, r) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
}

function newConnection(socket) {
    console.log("Nouveau client :" + socket.id);

    socket.on('mouse', mouseMsg);
    socket.on('start', starting);
    socket.on('update', updateData);
    //envoie les données à tous les clients
    function mouseMsg(data) {
        socket.broadcast.emit('mouse', clients);
        console.log(data);
    }
    //ajout du blob dans le tableaux de clients
    function starting(data) {
        console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
        var blob = new Blob(socket.id, data.x, data.y, data.r);
        clients.push(blob);
    }
    //actualisation des positions des joueurs
    function updateData(data) {
        var blob;
        //méthode simple mais pas otpimisée, faire une hashmap
        for (var i = 0; i < clients.length; i++) {
            if (socket.id = clients[i].id) {
                blob = clients[i];
            }
        }
        blob.x = data.x;
        blob.y = data.y;
        blob.r = data.r;
    }
}
function disconnection(socket) {
    console.log("Le client est parti :" + socket.id);
    var index = 0;
    for (var i = 0; i<clients.length; i++) {
        if(socket.id == clients[i].id) {
            index = i;
        }
    }
    clients.remove(index);
}