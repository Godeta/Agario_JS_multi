//19min 39, clean l'effet de dezoom !!!
var blob;

var blobs = [];
var zoom = 1;

function setup() {
  createCanvas(600, 600);
  blob = new Blob(0, 0, 64);
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
  //scale pour dezoomer à mesure que notre blob grossi
  scale(64 / blob.r);
  translate(-blob.pos.x, -blob.pos.y);
  //for qui part de la fin pour ne pas avoir de problème avec le split
  for (var i = blobs.length - 1; i >= 0; i--) {
    blobs[i].show();
    if (blob.eat(blobs[i])) {
      blobs.splice(i, 1);
    }
  }


  blob.show();
  blob.update();

}