// SETUP CANVAS

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;


// SETUP ANIMATION

const balls = [];
const NUMBER_OF_BALLS = 10;
const EVIL_CIRCLE_HORIZONTAL_SPEED = 20;
const EVIL_CIRCLE_VERTICAL_SPEED = 20;
var evilCircle;
Shape.prototype.checkBounds = checkBounds;
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;
Ball.prototype.draw = drawBall;
Ball.prototype.update = updateBall;
Ball.prototype.collisionDetect = collisionDetect;
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;
EvilCircle.prototype.draw = drawEvilCircle;
EvilCircle.prototype.update = updateEvilCircle;
EvilCircle.prototype.setControls = setControls;
loop();


// MAIN

function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  while (balls.length < NUMBER_OF_BALLS) {
    var ball = new Ball(
      random(20, width),
      random(20, height),
      random(-7, 7),
      random(-7, 7),
      getRandomColor(),
      random(10,20),
      true
    );
    balls.push(ball);
  }

  for (var i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
  }

  if (!evilCircle) {
    evilCircle = new EvilCircle(
      random(0, width),
      random(0, height),
      true
    );
    evilCircle.setControls();
  }

  evilCircle.draw();

  requestAnimationFrame(loop);
}



// CONSTRUCTORS AND PROTOTYPE FUNCTIONS

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

function Ball(x, y, velX, velY, color, size, exists) {
  Shape.call(this, x, y, velX, velY, exists);
  this.color = color;
  this.size = size;
}

function EvilCircle(x, y, exists) {
  Shape.call(this, x, y, 
    EVIL_CIRCLE_HORIZONTAL_SPEED, 
    EVIL_CIRCLE_VERTICAL_SPEED, exists);
  this.color = 'white';
  this.size = 10;
}

function drawBall() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

function updateBall() {
  this.collisionDetect();
  var status = this.checkBounds();
  if (status.hitsLeftWall || status.hitsRightWall) {
    this.velX = -(this.velX);
  }
  if (status.hitsTopWall || status.hitsBottomWall) {
    this.velY = -(this.velY);
  }
  this.x += this.velX;
  this.y += this.velY;
}

function updateEvilCircle() {
  var status = this.checkBounds();
  console.log(status);
  if (status.hitsLeftWall) {
    console.log("hit left wall");
    this.x = this.size;
  }
  if (status.hitsRightWall) {
    console.log("hit right wall");
    this.x = width - this.size;
  }
  if (status.hitsTopWall) {
    console.log("hit top wall");
    this.y = this.size;
  }
  if (status.hitsBottomWall) {
    console.log("hit bottom wall");
    this.y = height - this.size;
  }
}

function checkBounds() {
  var hitsLeftWall = (this.x - this.size) <= 0;
  var hitsRightWall = (this.x + this.size) >= width;
  var hitsTopWall = (this.y - this.size) <= 0;
  var hitsBottomWall = (this.y + this.size) >= height;
  return {
    hitsLeftWall,
    hitsRightWall,
    hitsTopWall,
    hitsBottomWall
  };
}

function collisionDetect() {
  for (var i = 0; i < balls.length; i++) {
    if (this == balls[i]) { continue; }
    var ball = balls[i];
    var distance = getDistance(this.x, this.y, 
                                ball.x, ball.y);
    if (distance <= this.size + ball.size) {
      this.velX = -(this.velX);
      this.velY = -(this.velY);
      ball.velX = -(ball.velX);
      ball.velY = -(ball.velY);
      ball.color = getRandomColor();
    } 
  }
}

function drawEvilCircle() {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 3;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
}

function setControls() {
  var _this = this;
  const KEY_LEFT = 37;
  const KEY_TOP = 38;
  const KEY_RIGHT = 39;
  const KEY_BOTTOM = 40;
  window.onkeydown = function(e) {
    switch (e.keyCode) {
      case KEY_LEFT:
        _this.x -= _this.velX;
        break;
      case KEY_TOP:
        _this.y -= _this.velY;
        break;
      case KEY_RIGHT:
        _this.x += _this.velX;
        break;
      case KEY_BOTTOM:
        _this.y += _this.velY;
        break;
      default:
    }
    _this.update();
  }
}

// UTILITY FUNCTIONS

function getDistance(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return Math.sqrt((dx * dx) + (dy * dy));
}

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function getRandomColor() {
  return 'rgb(' + random(0,255) + ',' +
                random(0,255) + ',' +
                random(0,255) + ')';
}
