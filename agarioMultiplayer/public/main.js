var socket;
var blob;

var blobs = [];
var clients = [];
var zoom = 1;

function setup() {
  createCanvas(600, 600);
  //connection
  // socket = io.connect('http://localhost:3000');
  socket = io();

  blob = new Blob(random(width), random(height), random(8, 48), false);
  //les données à envoyer au serveur
  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r
  }
  socket.emit('start', data);
  //actualisation de la position des autres clients
  socket.on('heartbeat',
    function (data) {
      clients = data;
      // console.log(data);
      //ajout de petites orbes à manger
      if(blobs.length<1000) {
      var x = random(-width, width);
    var y = random(-height, height);
    blobs.push(new Blob(x, y, 16) );
      }
    });
  for (var i = 0; i < 50; i++) {
    //on créer aussi des particules en dehors de la fenêtre vu qu'elle se déplace en fonctione de notre position avec translate
    var x = random(-width, width);
    var y = random(-height, height);
    blobs[i] = new Blob(x, y, 16);
  }
}

function draw() {
  background(0);
  //on déplace l'origine de notre canvas pour toujours voir notre blob au centre et donner un effet de mouvement cool
  translate(width / 2, height / 2); //au milieu
  //rendre l'effet de dezoom plus clean
  var newzoom = 64 / blob.r;
  zoom = lerp(zoom, newzoom, 0.1);
  //scale pour dezoomer à mesure que notre blob grossi
  scale(zoom);
  translate(-blob.pos.x, -blob.pos.y);
  //for qui part de la fin pour ne pas avoir de problème avec le split
  for (var i = blobs.length - 1; i >= 0; i--) {
    blobs[i].show();
    if (blob.eat(blobs[i])) {
      blobs.splice(i, 1);
    }
  }

  //affichage des autres joueurs
  for (var i = clients.length - 1; i >= 0; i--) {
    var id = clients[i].id;
    //pour chaque client du tableau sauf le client actuel qui execute le code (pour ne pas se faire apparaître soi-même), on peut vérifier sa valeur dans la console de chrome en tapant socket.id
    if (id !== socket.id) {
      fill(0, 0, 255);
      ellipse(clients[i].x, clients[i].y, clients[i].r * 2, clients[i].r * 2);

      fill(255);
      textAlign(CENTER);
      textSize(4);
      text(clients[i].id, clients[i].x, clients[i].y + clients[i].r);
    }
    // clients[i].show();
    // if (blob.eat(clients[i])) {
    //   clients.splice(i, 1);
    // }
  }


  blob.show();
  blob.update();
  blob.constrain();
  //update de la position
  //les données à envoyer au serveur
  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r
  }
  socket.emit('update', data);

}