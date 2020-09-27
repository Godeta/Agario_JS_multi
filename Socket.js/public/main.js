var socket;
let extraCanvas; //ajoute un deuxième fond
let mode = 0;

function setup() {
  createCanvas(400, 400);
  //ne sert à rien de faire le deuxième Canvas plsu grand car il est inséré comme image
  extraCanvas = createGraphics(600, 600);
  //extraCanvas.background(100,200,50);
  extraCanvas.clear(); //transparent
  //connection
  // socket = io.connect('http://localhost:3000');
  socket = io();
  //si il reçoit un message "mouse"
  socket.on('mouse', newDrawing);
}

function newDrawing(data) {
  //on affiche selon les données de data
  if (data.mode % 2 == 0) {
    extraCanvas.fill(255);
    extraCanvas.noStroke();
    extraCanvas.ellipse(data.x, data.y, 50, 50);
  } else { //se déplace avec trace
    extraCanvas.fill(100, 255, 200, 150);
    extraCanvas.noStroke();
    extraCanvas.ellipse(data.x, data.y, 50, 50);
  }
}

function draw() {
  // No trails!
  background(51);

  //deuxième fond
  image(extraCanvas, 0, 0);

  //si on maintient la souris appuyé
  if (mouseIsPressed) {
    //les données à envoyer au serveur
    var data = {
      x: mouseX,
      y: mouseY,
      mode: mode
    }
    socket.emit('mouse', data);

    if (mode % 2 == 0) { //rond se déplace sans trace
      fill(255, 150);
      noStroke();
      ellipse(mouseX, mouseY, 50, 50);
    } else { //se déplace avec trace
      extraCanvas.fill(255, 100, 200, 150);
      extraCanvas.noStroke();
      extraCanvas.ellipse(mouseX, mouseY, 50, 50);
    }
  }

}

function mouseReleased() {
  mode++;
}