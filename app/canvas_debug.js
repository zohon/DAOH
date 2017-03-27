import utils from './utils';
var debug = document.getElementById("debug");
var debugContext = debug.getContext("2d");


const calc = () => {
  var width = window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

  var height = window.innerHeight
  || document.documentElement.clientHeight
  || document.body.clientHeight;

  debug.width  = width;
  debug.height = height;
}

calc();

module.exports = {
    debug: debug,
    debugContext : debugContext
}
