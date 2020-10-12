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

//boucle qui envoie les données de chaque clients à tout le monde
setInterval(heartbeat, 50);

function heartbeat() {
    io.sockets.emit('heartbeat',clients);
}

//un tableau pour chaque client qui se connecte au serveur
var clients = [];

function Blob(id, x, y, r,name) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
    this.name = name;
}

function newConnection(socket) {
    console.log("Nouveau client :" + socket.id);
     soCid = socket.id;
    
    //en cas de deconnection
    socket.on("disconnect", function (soCid) {
    console.log("Le client est parti :" + soCid );
    var index = 0;
    for (var i = 0; i<clients.length; i++) {
        console.log("Id du client déconnecté :"+soCid+" id du client du tableau : "+clients[i].id);
        if(soCid == clients[i].id) {
            index = i;
        }
    }
    clients.splice(index, 1);
    });
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
        console.log(socket.id + " " + data.x + " " + data.y + " " + data.r + " "+data.name);
        var blob = new Blob(socket.id, data.x, data.y, data.r,data.name);
        clients.push(blob);
    }
    //actualisation des positions des joueurs
    function updateData(data) {
        var blob;
        //méthode simple mais pas otpimisée, faire une hashmap, parcours inverse si jamais on supp un client
        for (var i = clients.length-1; i >=0; i--) {
            //attention 2 fois = dans les if !!!
            if (socket.id == clients[i].id) {
                blob = clients[i];
            }
        }
        try {
        blob.x = data.x;
        blob.y = data.y;
        blob.r = data.r;
        }
        catch (e){
            console.error(e);
        }
    }
}