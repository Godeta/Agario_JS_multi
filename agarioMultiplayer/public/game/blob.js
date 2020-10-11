function Blob(x, y, r, PerfectCircle = true,name ="nobody") {
  this.pos = createVector(x, y);
  this.r = r;
  this.vel = createVector(0, 0);
  this.name = name;
  var yoff = 0;

  this.show = function () {
    fill(255);
    if (PerfectCircle) {
      ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    } else {
      //on refait une forme elliptique mais de manière à ce qu'elle change
      push();
      translate(this.pos.x, this.pos.y);
      beginShape();
      //la forme est crée en reliant des points tracés de manière à faire un cercle, si on change les points la forme se tord
      var xoff = 0;
      for (var i = 0; i < TWO_PI; i += 0.1) {
        var offset = map(noise(xoff, yoff), -1, 1, -25, 25);
        var r = this.r + offset;
        var x = r * cos(i);
        var y = r * sin(i);
        vertex(x, y);
        xoff += 0.1;
        //ellipse(x,y,4,4);
      }
      endShape();
      pop();
      yoff += 0.01;
    }
  }
  this.update = function () {
    var mouse = createVector(mouseX, mouseY);
    //on va en direction d'un vecteur qui lie la position de la souris par rapport à la position de notre boule
    //mouse.sub(this.pos);
    //comme on a fait un translate pour garder notre blob au milieu 
    mouse.sub(width / 2, height / 2);
    //le vecteur aura constamment la vitesse de 3
    mouse.setMag(5);
    //pour que les déplacements aient de minis accélerations, sinon vitesse uniforme bizarre
    this.vel.lerp(mouse, 0.2);
    this.pos.add(this.vel);
    //affichage flèche pour le déplacement
    drawArrow(this.pos, mouse, 200);
  }

  this.eat = function (other) {
    var d = p5.Vector.dist(this.pos, other.pos);
    //si la distance entre les deux blobs est inférieur au rayo nde l'un + le rayon de l'autre
    if (d < this.r + other.r) {
      //this.r += other.r/5; fonctionne mais y'a mieux
      //on ajoute l'aire
      var sum = PI * this.r * this.r + PI * other.r * other.r;
      this.r = sqrt(sum / PI);
      return true;
    } else {
      return false;
    }
  }
  this.constrain = function () {
    blob.pos.x = constrain(blob.pos.x, -width , width );
    blob.pos.y = constrain(blob.pos.y, -height, height );
  };

  function drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }
}