
import player from './player';
import monster from './monster';
var canvas = document.getElementById('main');
var context = canvas.getContext('2d');
context.scale(2, 2);

const init = () => {
  window.onresize = function(event) {
      calc(canvas);
  };
  calc(canvas);
  return context;
}

const reset = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

const calc = (canvas) => {
  console.log("calc");
  var width = window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

  var height = window.innerHeight
  || document.documentElement.clientHeight
  || document.body.clientHeight;

  canvas.width  = width;
  canvas.height = height;
}

var lastCalledTime;
var fps;

const initdraw = (animate) => {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  const draw = () => {
    var infosFps = calcFPS();
    animate(infosFps);
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

const calcFPS = () => {
  if(!lastCalledTime) {
      lastCalledTime = Date.now();
      fps = 0;
   }
   var delta = (Date.now() - lastCalledTime)/1000;
   lastCalledTime = Date.now();
   fps = 1/delta;
   //document.getElementById("fps").innerHTML = fps;
   //console.log("FPS", fps);
   return fps;
}

const display = (store) => {
  reset();
  context.imageSmoothingEnabled = false;
  player.draw(context, store.getState().player);

  monster.draw(context, store.getState().monster);
}


module.exports = {
  reset : reset,
  init : init,
  initdraw : initdraw,
  calc : calc,
  display : display
}
