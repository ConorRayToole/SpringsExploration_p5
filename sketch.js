let weightPosition;
let velocity;
let acceleration;
let anchor;
let action;
let gravity;
let spring;

function setup() {
  createCanvas(600, 600);
  weightPosition = createVector(height/2,width/2);
  velocity = createVector(0, 0);
  acceleration = createVector(0, 0);
  anchor = createVector(width/2,0);
  spring = new Spring(anchor, weightPosition, 0.002, 100);
  gravity = createVector(0,0.3);
  action = true;
}

function mouseDragged() {
  acceleration = createVector(0, 0);
  if (weightPosition.x - 12 < mouseX < weightPosition.x + 12 && weightPosition.y - 12 < mouseY < weightPosition.y + 12) {
    action = false;
    acceleration = createVector(0, 0);
    velocity = createVector(0, 0);
    weightPosition.x = mouseX;
    weightPosition.y = mouseY;
  }
}

function mouseReleased() {
  action = true;
}

function applyForces(forces) {
  forces.forEach(force => {
    acceleration.add(force);
  });
}

function draw() {
  background(220);
  fill(100, 200, 50);
  if (action) {
    //spring calculations
    spring.update(anchor, weightPosition);
    
    //friction calculations
    let friction = acceleration.copy();
    friction.normalize();
    friction.mult(-0.01);
    
    //apply forces 
    applyForces([spring.springForce, friction, gravity]);
    weightPosition.add(acceleration);
  }
  line(anchor.x, anchor.y, weightPosition.x, weightPosition.y);
  circle(weightPosition.x, weightPosition.y, 24);  
}

class Spring {
  constructor (a, b, strength, restLength) {
    this.a = a; // location of one end of spring 
    this.b = b; // location of other end of spring 
    this.strength = strength; // k
    this.restLength = restLength; 
    this.springForce = createVector(0,0);
  }
  
  calculateForce (){
    this.springForce = p5.Vector.sub(this.a, this.b);
    let currentLength = this.springForce.mag();
    let x = currentLength - this.restLength;
    this.springForce.setMag(x * this.strength);
  }
  
  update(a, b) {
    this.a = a;
    this.b = b;
    this.calculateForce();
  }
}