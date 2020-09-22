
var blob;

var blobs = [];
var zoom = 1;

function setup() {
  createCanvas(600, 600);
  blob = new Blob(width/2, height/2, 64);
  for (var i = 0; i < 50; i++) {
    var x = random(-width, width);
    var y = random(-height, height);
    blobs[i] = new Blob(x, y, 16);
  }
}

function draw() {
  background(0);

  for (var i = blobs.length - 1; i >= 0; i--) {
    blobs[i].show();
  }


  blob.show();

}