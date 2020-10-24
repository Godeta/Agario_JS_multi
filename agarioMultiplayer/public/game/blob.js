function Blob(x, y, r, PerfectCircle = true,name ="nobody", skin) {
  this.pos = createVector(x, y);
  this.r = r;
  this.vel = createVector(0, 0);
  this.name = name;
  this.skin = skin;
  var yoff = 0;
  var img;
  var colorT = [random(255),random(255),random(40,200)];
  var movingAbs =0, movingOrd =0, xoff = random(0,100), yoff = random(1000,10000);
  
  if(!PerfectCircle) {
    var url = "img/"+skin+".png";
    img = loadImage(url,yes=> {console.log("L'image a bien chargée !")},no=> {skin="Aucun";} );
  }
  this.show = function () {
    fill(colorT[0],colorT[1],colorT[2]);
    if (PerfectCircle) {
      ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    } else {
      //si on n'a pas choisi de skin
      if(skin == "Aucun") {
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
    //sinon
    else {
      // drawIMG();
      // image(img,this.pos.x,this.pos.y,this.r*2,this.r*2);
      ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
      // code déplacé dans le update
    }
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
    if(skin == "Aucun") {
    //affichage flèche pour le déplacement
    drawArrow(this.pos, mouse, 200);
    }
    else {
    drawIMG(this.pos,mouse,img,this.r*4);
    }
  }

  this.updateOther = function (x,y,r) {
    var newV = createVector(x,y);
    xoff+= 0.01;
    yoff+=0.02;
    //bruit plus ou moins random entre 0 et 1 donne valeur entre 0 et width
    movingAbs = map(noise(xoff),0,1,-10,10);
    movingOrd = map(noise(yoff),0,1,0-10,10);
    console.log(movingAbs + " "+ movingOrd);
    drawIMG(newV,createVector(movingAbs,movingOrd),img,this.r*4);
    this.pos = newV;
    this.r = r;
  }

  this.eat = function (other) {
    // pour le manger le blob doit être plus grand que l'autre blob
    if (this.r > other.r) {
    var d = p5.Vector.dist(this.pos, other.pos);
    //si la distance entre les deux blobs est inférieur au rayon de l'un + le rayon de l'autre
    if (d < this.r + other.r) {
      //this.r += other.r/5; fonctionne mais y'a mieux
      //on ajoute l'aire
      var sum = PI * this.r * this.r + PI * other.r * other.r;
      this.r = sqrt(sum / PI);
      return true;
    } 
  }
  return false;
  }
  this.constrain = function (MAPSIZE) {
    blob.pos.x = constrain(blob.pos.x, -width*MAPSIZE , width*MAPSIZE );
    blob.pos.y = constrain(blob.pos.y, -height*MAPSIZE, height*MAPSIZE );
  };

  function drawIMG(base, vec, img,size) {
    push();
    translate(base.x, base.y);
    rotate(vec.heading());
    translate(vec.mag(), 0);
    image(img,vec.x,vec.y,size,size);
    pop();
  }
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