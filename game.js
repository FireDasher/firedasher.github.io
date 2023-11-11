const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
resize();
let x = canvas.width/2;
let y = canvas.height/2;
let sx = 0;
let sy = 0;
//key detecter
var pressedKeys = {};
window.onkeyup = function(e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKeys[e.keyCode] = true; }
tick();

//tick
function tick() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillRect(x-5,canvas.height-(y+5),10,10);

  //friction
  sx *= 0.8;
  sy *= 0.8;

  //controls
  if (key(38)) {
    sy += 1.5;
  }
  if (key(40)) {
   sy -= 1.5;
  }
  if (key(39)) {
    sx += 1.5;
  }
  if (key(37)) {
    sx -= 1.5;
  }

  x += sx;
  y += sy;

  //other
  window.requestAnimationFrame(tick);
}

window.onresize = function(){
  resize();
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function key(code) {
  return pressedKeys[code];
}
