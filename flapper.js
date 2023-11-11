//flapper.js :)
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var flappy = new Image();
flappy.src = "https://www.pngmart.com/files/12/Flappy-Bird-Logo-Transparent-Background.png";
flapSound = new Audio("https://www.myinstants.com/media/sounds/sfx_wing.mp3");
explosion = new Audio("https://www.myinstants.com/media/sounds/vine-boom.mp3"); //https://www.myinstants.com/media/sounds/explosion-meme_dTCfAHs.mp3
let music = new Audio("https://github.com/Logi473/buckle/raw/main/one%20two%20buckle%20my%20shoe.mp3");
var sy = 7;
var pos = canvas.height / 2;
var pipex = canvas.width + 50;
var pipey = rng();
var pipeSpace = 75;
var score = 0;
var canchangescore = true;
var m = canvas.width / 2;

window.onbeforeunload = function(e) {
  return "you are an idiot! 😃😃😃";
}

function tick() {
  //This executes every frame
  //Clear
  ctx.clearRect(0,0,canvas.width,canvas.height);
  //Player
  pos += sy;
  sy -= 0.4;
  //ctx.fillRect(canvas.width / 2,canvas.height - pos,50,50);
  ctx.drawImage(flappy, m, canvas.height - pos-50/2 ,50,50)

  //pipe
  ctx.fillStyle = "green";
  ctx.fillRect(pipex - 50/2, canvas.height - (pipey - pipeSpace), 50, 1000);
  ctx.fillRect(pipex - 50/2, canvas.height - (pipey + (1000 + pipeSpace)), 50, 1000);
  ctx.fillRect(pipex - 100/2, canvas.height - (pipey - pipeSpace), 100, 25);
  ctx.fillRect(pipex - 100/2, canvas.height - (pipey + pipeSpace + 25), 100, 25);
  pipex -= 10;

  if (pipex < -50) {
    pipex = canvas.width + 50;
    pipey = rng();
    canchangescore = true;
  }

  //checking for death
  if (canvas.height - pos > canvas.height || canvas.height - pos < 0) {
    explosion.load();
    explosion.play();
    reset();
  }

  if (m > pipex-25 && m < pipex+25 && !(pos < pipey + pipeSpace && pos > pipey - pipeSpace) ) {
    explosion.load();
    explosion.play();
    reset();
  }

  //text
  ctx.font = "30px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(score, 10, 30);
  if (pipex < m && canchangescore) {
    score++;
    canchangescore = false;
  }
}

//other

function rng() {
  return (Math.random() * (canvas.height - pipeSpace)) + pipeSpace;
}

document.onkeydown = function (e) {

  if (e.key == " ") {
    jump();
  }

  if (e.key == "r") {
reset();
  }

  if (e.key == "d") {
    alert(canvas.height - pos + " " + canvas.height);
  }

}

window.addEventListener('touchstart', (event) => {
  jump();
})

window.addEventListener('mousedown', (event) => {
  jump();
})

function reset() {
  sy = 8;
  pos = canvas.height / 2;
  pipex = canvas.width + 50;
  pipey = rng();
  score = 0;
  canchangescore = true;
}

function loop(timestamp) {
  var progress = timestamp - lastRender

  tick()

  lastRender = timestamp
  window.requestAnimationFrame(loop)
}
var lastRender = 0
window.requestAnimationFrame(loop)

function jump() {
  sy = 8;
  flapSound.load();
  flapSound.play();
  music.play();
  music.loop = true;
}
