function Blob(x, y, r) {
  this.pos = createVector(x, y);
  this.r = r;

  this.show = function () {
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
  this.update = function () {
    var mouse = createVector(mouseX, mouseY);
    //on va en direction d'un vecteur qui lie la position de la souris par rapport à la position de notre boule
    //mouse.sub(this.pos);
    //comme on a fait un translate pour garder notre blob au milieu 
    mouse.sub(width / 2, height / 2);
    //le vecteur aura constamment la vitesse de 3
    mouse.setMag(4);
    this.pos.add(mouse);
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
}