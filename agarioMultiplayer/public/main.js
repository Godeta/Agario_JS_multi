var input;
var button;
var nom;
var selectSkin;
function setup() {
  createCanvas(480, 120);
  resetSetup();
  var button = createButton("reset");
  button.mousePressed(resetSetup);
}

function resetSetup() {
  input = createInput();
  input.position(20, 150);
  button = createButton("submit");
  button.position(160, 150);
  button.mousePressed(drawName);

  //choisir le skin
  selectSkin = createSelect();
  selectSkin.option('Paul');
  selectSkin.option('Titouan');
  selectSkin.option('Jesus');
  selectSkin.option('Antoine');
  selectSkin.option('Aucun');
  
  background(100);
  noStroke();
  text("Enter your name.", 20, 20);
}

function drawName() {
  background(100);
  textSize(30);
   nom = input.value();
  for (var i=0; i < 30; i++) {
    fill(random(255));
    text(name, random(width), random(height));
  }
  localStorage["nom"] = nom;
  localStorage["skin"] = selectSkin.value();
  window.location = "game/index.html";
}