var socket;
var blob;

var blobs = [];
var clients = [];
var cliBLobs = {}; //dictionnaire des blobs
var biggest = [];
var zoom = 1;
var div;
var nom = localStorage["nom"];
var skin = localStorage["skin"];

const MAPSIZE = 4;


function setup() {
  createCanvas(600, 600);
  imageMode(CENTER);
  for(var i =0; i<50; i++) {
    var x = random(-width*MAPSIZE, width*MAPSIZE);
  var y = random(-height*MAPSIZE, height*MAPSIZE);
  blobs.push(new Blob(x, y, 16) );
      }
  //texte pour l'affichage des plus gros blob
   div = createDiv('').size(100, 100);
  //connection
  // socket = io.connect('http://localhost:3000');
  socket = io();
  // blob = new Blob(random(width*MAPSIZE), random(height*MAPSIZE), random(8, 48), false, nom, skin);
  
  blob = new Blob(0, 0, random(8, 48), false, nom, skin);
  //les données à envoyer au serveur
  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r,
    name:nom,
    img:skin
  }
  socket.emit('start', data);
  //actualisation de la position des autres clients
  socket.on('heartbeat',
    function (data) {
      clients = data;
      // console.log(data);
      //ajout de petites orbes à manger
      if(blobs.length<1000) {
      var x = random(-width*MAPSIZE, width*MAPSIZE);
    var y = random(-height*MAPSIZE, height*MAPSIZE);
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
      // ellipse(clients[i].x, clients[i].y, clients[i].r * 2, clients[i].r * 2);
      //on essaye de récupérer le blob de cet id à afficher
      try {
        var cliblob = cliBLobs[clients[i].id];
        cliblob.show();
        cliblob.updateOther(clients[i].x,clients[i].y,clients[i].r);
      }
      //sinon on le créé
      catch (error) {
        console.log(clients[i].img);
        cliBLobs[clients[i].id] = new Blob(clients[i].x, clients[i].y, clients[i].r,false,clients[i].name,clients[i].img);
      }

      fill(200,30,0);
      textAlign(CENTER);
      textSize(clients[i].r/3);
      text(clients[i].name, clients[i].x, clients[i].y + clients[i].r);

    }
    // clients[i].show();
    // if (blob.eat(clients[i])) {
    //   clients.splice(i, 1);
    // }
  }


  blob.show();
  if(mouseIsPressed){
  blob.update();
  }
  blob.constrain(MAPSIZE);
  //affichage des 5 plus gros
  biggest = sort2(clients);
  if(clients.length>1) {
    div.html("Classement : <br/>");
    var min = clients.length>6 ? 6 : clients.length ;
  for  (var i=0; i<min; i++) {
    // fill(255);
    //   textAlign(LEFT);
    //   textSize(biggest[i].r/3);
    //   text(biggest[i].id, 10, i*50);
    div.html(i+1 + ") "+biggest[min-i-1].name + " <br/>",true);
  }
}
else {
  div.html("Pas encore de plus gros joueurs");
}

  //update de la position
  //les données à envoyer au serveur
  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r
  }
  socket.emit('update', data);

}

function sort2(clients2){
  var tab = clients2;
  for(var i = 0; i < tab.length; i++){
    //stocker l'index de l'élément minimum
    var min = i; 
    for(var j = i+1; j < tab.length; j++){
      if(tab[j].r < tab[min].r){
        // console.log(tab);
        // console.log(j);
        // console.log(tab[0].r);
       // mettre à jour l'index de l'élément minimum
       min = j; 
      }
    }
    var tmp = tab[i];
    tab[i] = tab[min];
    tab[min] = tmp;
  }
  // console.log(tab[id]);
  //  console.log(tab[1].r);
  return tab;
};