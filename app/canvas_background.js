import utils from './utils';
var canvas = document.getElementById('background');
var context = canvas.getContext('2d');
context.scale(2, 2);

var backgroundMouse = {};
var mousedown = false;

const init = () => {
  window.onresize = function(event) {
    calc(canvas);
  };
  calc(canvas);
  document.addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
    mousedown = "right";
    var x = Math.floor(event.clientX / 16.0) * 16;
    var y = Math.floor(event.clientY / 16.0) * 16;
    backgroundMouse = {
      x: x,
      y: y
    };
    return false;
  }, false);

  document.addEventListener("mousedown", function(event) {
    mousedown = true;
    var x = Math.floor(event.clientX / 16.0) * 16;
    var y = Math.floor(event.clientY / 16.0) * 16;
    backgroundMouse = {
      x: x,
      y: y
    };
  });
  document.addEventListener("mouseup", function(event) {
    mousedown = false;
    backgroundMouse = {};
  });

  document.addEventListener("mousemove", function(event) {
    var x = Math.floor(event.clientX / 16.0) * 16;
    var y = Math.floor(event.clientY / 16.0) * 16;
    backgroundMouse = {
      x: x,
      y: y
    };
  });
  generateLevel();
  return context;
}

const createBlock = (datas) => {

  var block = _.find(map, {
    'x': datas.x,
    'y': datas.y
  });

  if (!block) {
    getNear({
      x: datas.x,
      y: datas.y
    });

    map.push({
      x: datas.x,
      y: datas.y,
      type: (datas.type ? datas.type : "block"),
      status: (datas.status ? datas.status : "new")
    });

  }

}

const createBlocks = (datas) => {

  var multiX = 4;
  var multiY = 4;

  var data = {
    x: datas.x - (16 * ((multiX) / 2)),
    y: datas.y - (16 * ((multiY) / 2))
  };

  for (var nbX = 0; nbX < multiX; nbX++) {
    for (var nbY = 0; nbY < multiY; nbY++) {
      createBlock({
        x: data.x + (nbX * 16),
        y: data.y + (nbY * 16)
      });
    }
  }

}


const reset = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

const calc = (canvas) => {
  var width = window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  var height = window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  canvas.width = width;
  canvas.height = height;
}

var lastCalledTime;
var fps;

window.map = [];

// info element

const generateLevel = (width = 32, height = 32) => {

  width = Math.round(window.outerWidth / 4 / 16);
  height = Math.round(window.outerHeight / 4 / 16);

  nexStep({
    x: 0,
    y: 0
  }, {
    x: 32,
    y: 16
  });

  //console.log(map);
}

const nexStep = (prev, target) => {

  var newBlock = prev;


if (Math.random() < 0.5) {

  if (Math.random() < 0.5) {
    newBlock.x += 16;
  }else  {
    newBlock.x -= 16;
  }

} else {

    if (Math.random() < 0.5) {
      newBlock.y += 16;
    }else  {
      newBlock.y -= 16;
    }

}

  if(newBlock.x < 0) {
    newBlock.x = 0;
  }

  if(newBlock.y < 0) {
    newBlock.y = 0;
  }
    console.log(newBlock.y, window.outerHeight);
  if(newBlock.y >= window.outerHeight) {
    newBlock.y = window.outerHeight;
    console.log(window.outerHeight);
  }

  if(newBlock.x >= window.outerWidth) {
    newBlock.x = window.outerWidth;
    console.log(window.outerWidth);
  }

  // if(newBlock.x > target.x) {
  //   newBlock.x = target.x;
  // }
  //
  // if(newBlock.y > target.y) {
  //   newBlock.y = target.y;
  // }

  createBlocks(newBlock);

  setTimeout(function() {
      //console.log(newBlock);
      nexStep(newBlock, target);
  }, 50);

}


const initdraw = (animate) => {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  const draw = () => {
    var infosFps = calcFPS();
    animate(infosFps);
    requestAnimationFrame(draw);
  }

  //var infosFps = calcFPS();
  //animate(infosFps);
  requestAnimationFrame(draw);
}

const calcFPS = () => {
  if (!lastCalledTime) {
    lastCalledTime = Date.now();
    fps = 0;
  }
  var delta = (Date.now() - lastCalledTime) / 1000;
  lastCalledTime = Date.now();
  fps = 1 / delta;
  return fps;
}


var getNear = ({
  x = 0,
  y = 0,
  look = false
}) => {

  var block = _.find(map, {
    'x': x,
    'y': y
  });
  var blockEast = _.find(map, {
    'x': x + 16,
    'y': y
  });
  var blockWest = _.find(map, {
    'x': x - 16,
    'y': y
  });
  var blockSouth = _.find(map, {
    'x': x,
    'y': y + 16
  });
  var blockNorth = _.find(map, {
    'x': x,
    'y': y - 16
  });

  var blockNorthWest = _.find(map, {
    'x': x - 16,
    'y': y - 16
  });

  var blockNorthEast = _.find(map, {
    'x': x + 16,
    'y': y - 16
  });

  var blockSouthWest = _.find(map, {
    'x': x - 16,
    'y': y + 16
  });

  var blockSouthEast = _.find(map, {
    'x': x + 16,
    'y': y + 16
  });

  if (look) {
    return {
      block: block,
      blockNorth: blockNorth,
      blockEast: blockEast,
      blockSouth: blockSouth,
      blockWest: blockWest,
      blockNorthWest: blockNorthWest,
      blockNorthEast: blockNorthEast,
      blockSouthWest: blockSouthWest,
      blockSouthEast: blockSouthEast
    };
  }

  if (blockNorth && blockNorth.type == "block") {
    blockNorth.status = "refresh";
  }
  if (blockEast && blockEast.type == "block") {
    blockEast.status = "refresh";
  }
  if (blockSouth && blockSouth.type == "block") {
    blockSouth.status = "refresh";
  }
  if (blockWest && blockWest.type == "block") {
    blockWest.status = "refresh";
  }

  if (blockNorthWest && blockNorthWest.type == "block") {
    blockNorthWest.status = "refresh";
  }
  if (blockNorthEast && blockNorthEast.type == "block") {
    blockNorthEast.status = "refresh";
  }
  if (blockSouthWest && blockSouthWest.type == "block") {
    blockSouthWest.status = "refresh";
  }
  if (blockSouthEast && blockSouthEast.type == "block") {
    blockSouthEast.status = "refresh";
  }


}

var tilesImage = utils.getImage('media/tiles.png');
var animFlower = 0;

var lastbackgroundMouse = {};

const mouseAction = (params) => {

  if (lastbackgroundMouse.x && lastbackgroundMouse.y && !_.isEqual(backgroundMouse, lastbackgroundMouse)) {

    var lastdiffX = backgroundMouse.x - lastbackgroundMouse.x;
    var lastdiffY = backgroundMouse.y - lastbackgroundMouse.y;

    var nbMissX = Math.abs(lastdiffX / 16);
    var nbMissY = Math.abs(lastdiffY / 16);

    for (var x = 0; x <= nbMissX; x++) {
      var newX = 0;
      if (lastdiffX < 0) {
        newX = lastbackgroundMouse.x - (x * 16);
      } else {
        newX = lastbackgroundMouse.x + (x * 16);
      }
      createBlocks({
        x: newX,
        y: backgroundMouse.y
      });
    }

    for (var y = 0; y <= nbMissY; y++) {
      var newY = 0;
      if (lastdiffY < 0) {
        newY = lastbackgroundMouse.y - (y * 16);
      } else {
        newY = lastbackgroundMouse.y + (y * 16);
      }
      createBlocks({
        x: backgroundMouse.x,
        y: newY
      });

    }

  }
  lastbackgroundMouse = backgroundMouse;
  createBlocks(backgroundMouse);
}


const display = (store) => {
  //reset();

  if (!mousedown) {
    lastbackgroundMouse = {};
    //return;
  }

  if (backgroundMouse && mousedown) {
    mouseAction();
  }

  context.imageSmoothingEnabled = false;

  var litenMap = _.filter(map, function(o) {
    return o.status != 'done';
  });
  //litenMap = litenMap.slice(0,30);
  _.each(litenMap, function(tile, tilesIndex) {

    var x = tile.x;
    var y = tile.y;

    context.clearRect(0 + x, 0 + y, 16, 16);

    switch (tile.type) {
      case "block":
        //context.fillStyle = "#d0c090";
        tile.status = "done";
        var blockEast = _.find(map, {
          'x': x + 16,
          'y': y
        });
        var blockWest = _.find(map, {
          'x': x - 16,
          'y': y
        });
        var blockSouth = _.find(map, {
          'x': x,
          'y': y + 16
        });
        var blockNorth = _.find(map, {
          'x': x,
          'y': y - 16
        });

        var blockNorthWest = _.find(map, {
          'x': x - 16,
          'y': y - 16
        });

        var blockNorthEast = _.find(map, {
          'x': x + 16,
          'y': y - 16
        });

        var blockSouthWest = _.find(map, {
          'x': x - 16,
          'y': y + 16
        });

        var blockSouthEast = _.find(map, {
          'x': x + 16,
          'y': y + 16
        });

        var arryPresent = [];
        if (blockNorth && blockNorth.type) {
          arryPresent.push("N");
        }
        if (blockEast && blockEast.type) {
          arryPresent.push("E");
        }
        if (blockSouth && blockSouth.type) {
          arryPresent.push("S");
        }
        if (blockWest && blockWest.type) {
          arryPresent.push("W");
        }

        // all block
        if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W"].sort())) {

          if (blockNorthWest && blockNorthWest.type) {
            arryPresent.push("NW");
          }
          if (blockNorthEast && blockNorthEast.type) {
            arryPresent.push("NE");
          }
          if (blockSouthWest && blockSouthWest.type) {
            arryPresent.push("SW");
          }
          if (blockSouthEast && blockSouthEast.type) {
            arryPresent.push("SE");
          }


          if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W", "NE", "SE", "SW"].sort())) {
            context.drawImage(tilesImage.element, 16 * 7, 16 * 3, 16, 16, 0 + x, 0 + y, 16, 16);
            modify(context, 0 + x, 0 + y, 16, 16);
            return;
          }

          if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W", "NW", "SE", "SW"].sort())) {
            context.drawImage(tilesImage.element, 16 * 6, 16 * 3, 16, 16, 0 + x, 0 + y, 16, 16);
            modify(context, 0 + x, 0 + y, 16, 16);
            return;
          }

          if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W", "NW", "NE", "SE"].sort())) {
            context.drawImage(tilesImage.element, 16 * 7, 16 * 2, 16, 16, 0 + x, 0 + y, 16, 16);
            modify(context, 0 + x, 0 + y, 16, 16);
            return;
          }

          if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W", "NW", "NE", "SW"].sort())) {
            context.drawImage(tilesImage.element, 16 * 6, 16 * 2, 16, 16, 0 + x, 0 + y, 16, 16);
            modify(context, 0 + x, 0 + y, 16, 16);
            return;
          }

          if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W", "SE", "SW"].sort())) {
            context.drawImage(tilesImage.element, 16 * 6, 16 * 6, 16, 16, 0 + x, 0 + y, 16, 16);
            modify(context, 0 + x, 0 + y, 16, 16);
            return;
          }

          if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W", "NE", "NW"].sort())) {
            context.drawImage(tilesImage.element, 16 * 6, 16 * 7, 16, 16, 0 + x, 0 + y, 16, 16);
            modify(context, 0 + x, 0 + y, 16, 16);
            return;
          }


          if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W", "NW", "SW"].sort())) {
            context.drawImage(tilesImage.element, 16 * 7, 16 * 6, 16, 16, 0 + x, 0 + y, 16, 16);
            modify(context, 0 + x, 0 + y, 16, 16);
            return;
          }

          if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W", "NE", "SE"].sort())) {
            context.drawImage(tilesImage.element, 16 * 7, 16 * 7, 16, 16, 0 + x, 0 + y, 16, 16);
            modify(context, 0 + x, 0 + y, 16, 16);
            return;
          }


          if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W", "NE", "SW"].sort())) {
            context.drawImage(tilesImage.element, 16 * 7, 16 * 1, 16, 16, 0 + x, 0 + y, 16, 16);
            modify(context, 0 + x, 0 + y, 16, 16);
            return;
          }

          if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W", "NW", "SE"].sort())) {
            context.drawImage(tilesImage.element, 16 * 6, 16 * 1, 16, 16, 0 + x, 0 + y, 16, 16);
            modify(context, 0 + x, 0 + y, 16, 16);
            return;
          }

          if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W"].sort())) {
            context.drawImage(tilesImage.element, 16 * 5, 16 * 1, 16, 16, 0 + x, 0 + y, 16, 16);
            modify(context, 0 + x, 0 + y, 16, 16);
            return;
          }

          context.fillStyle = "#705f30";
          context.fillRect(0 + x, 0 + y, 16, 16);

          modify(context, 0 + x, 0 + y, 16, 16);

          if (!tile.lock && Math.random() <= 0.1) {
            var randomGrass = Math.random();
            if (randomGrass >= 0.9) {
              tile.type = 'grass';
              tile.status = "update";
              tile.solid = false;
              tile.element = 6;
            } else if (randomGrass >= 0.8) {
              tile.type = 'grass';
              tile.status = "update";
              tile.solid = false;
              tile.element = 4;
            } else if (randomGrass > 0.6) {
              tile.type = 'bush';
              tile.status = "update";
              tile.element = 0;
              tile.solid = true;
              tile.lock = true;
            } else {
              tile.type = 'grass';
              tile.status = "update";
              tile.solid = false;
              tile.element = 1;
            }
          } else {
            tile.lock = true;
          }

          return;
        }


        // no block
        if (arryPresent.length == 0) {
          context.drawImage(tilesImage.element, 16 * 3, 16 * 6, 16, 16, 0 + x, 0 + y, 16, 16);
          modify(context, 0 + x, 0 + y, 16, 16);
          return;
        }

        if (_.isEqual(arryPresent.sort(), ["N"].sort())) {
          context.drawImage(tilesImage.element, 16 * 4, 16 * 7, 16, 16, 0 + x, 0 + y, 16, 16);
          modify(context, 0 + x, 0 + y, 16, 16);
          return;
        }

        if (_.isEqual(arryPresent.sort(), ["N", "W", "E"].sort())) {
          context.drawImage(tilesImage.element, 16 * 4, 16 * 3, 16, 16, 0 + x, 0 + y, 16, 16);
          modify(context, 0 + x, 0 + y, 16, 16);
          return;
        }

        if (_.isEqual(arryPresent.sort(), ["N", "E"].sort())) {
          context.drawImage(tilesImage.element, 16 * 2, 16 * 5, 16, 16, 0 + x, 0 + y, 16, 16);
          modify(context, 0 + x, 0 + y, 16, 16);
          return;
        }

        if (_.isEqual(arryPresent.sort(), ["N", "W"].sort())) {
          context.drawImage(tilesImage.element, 16 * 3, 16 * 5, 16, 16, 0 + x, 0 + y, 16, 16);
          modify(context, 0 + x, 0 + y, 16, 16);
          return;
        }

        if (_.isEqual(arryPresent.sort(), ["S"].sort())) {
          context.drawImage(tilesImage.element, 16 * 5, 16 * 7, 16, 16, 0 + x, 0 + y, 16, 16);
          modify(context, 0 + x, 0 + y, 16, 16);
          return;
        }


        if (_.isEqual(arryPresent.sort(), ["S", "W", "E"].sort())) {
          context.drawImage(tilesImage.element, 16 * 4, 16 * 2, 16, 16, 0 + x, 0 + y, 16, 16);
          modify(context, 0 + x, 0 + y, 16, 16);
          return;
        }

        if (_.isEqual(arryPresent.sort(), ["S", "E"].sort())) {
          context.drawImage(tilesImage.element, 16 * 2, 16 * 4, 16, 16, 0 + x, 0 + y, 16, 16);
          modify(context, 0 + x, 0 + y, 16, 16);
          return;
        }

        if (_.isEqual(arryPresent.sort(), ["S", "W"].sort())) {
          context.drawImage(tilesImage.element, 16 * 3, 16 * 4, 16, 16, 0 + x, 0 + y, 16, 16);
          modify(context, 0 + x, 0 + y, 16, 16);
          return;
        }

        if (_.isEqual(arryPresent.sort(), ["S", "N"].sort())) {
          context.drawImage(tilesImage.element, 16 * 6, 16 * 4, 16, 16, 0 + x, 0 + y, 16, 16);
          modify(context, 0 + x, 0 + y, 16, 16);
          return;
        }

        if (_.isEqual(arryPresent.sort(), ["W"].sort())) {
          context.drawImage(tilesImage.element, 16 * 4, 16 * 6, 16, 16, 0 + x, 0 + y, 16, 16);
          modify(context, 0 + x, 0 + y, 16, 16);
          return;
        }

        if (_.isEqual(arryPresent.sort(), ["W", "N", "S"].sort())) {
          context.drawImage(tilesImage.element, 16 * 5, 16 * 2, 16, 16, 0 + x, 0 + y, 16, 16);
          modify(context, 0 + x, 0 + y, 16, 16);
          return;
        }

        if (_.isEqual(arryPresent.sort(), ["E", "N", "S"].sort())) {
          context.drawImage(tilesImage.element, 16 * 5, 16 * 3, 16, 16, 0 + x, 0 + y, 16, 16);
          modify(context, 0 + x, 0 + y, 16, 16);
          return;
        }

        if (_.isEqual(arryPresent.sort(), ["E"].sort())) {
          context.drawImage(tilesImage.element, 16 * 5, 16 * 6, 16, 16, 0 + x, 0 + y, 16, 16);
          modify(context, 0 + x, 0 + y, 16, 16);
          return;
        }

        if (_.isEqual(arryPresent.sort(), ["W", "E"].sort())) {
          context.drawImage(tilesImage.element, 16 * 7, 16 * 4, 16, 16, 0 + x, 0 + y, 16, 16);
          modify(context, 0 + x, 0 + y, 16, 16);
          return;
        }

        context.fillStyle = "#705f30";
        context.fillRect(0 + x, 0 + y, 16, 16);
        modify(context, 0 + x, 0 + y, 16, 16);

        break;
      case "desert":
        context.fillStyle = "#705f30";
        context.fillRect(0 + x, 0 + y, 16, 16);
        context.drawImage(tilesImage.element, 16 * 1, 16 * 8, 16, 16, 0 + x, 0 + y, 16, 16);
        modify(context, 0 + x, 0 + y, 16, 16);
        break;
      case "lava":
        context.fillStyle = "#705f30";
        context.fillRect(0 + x, 0 + y, 16, 16);
        context.drawImage(tilesImage.element, 16 * 0, 16 * 8, 16, 16, 0 + x, 0 + y, 16, 16);
        modify(context, 0 + x, 0 + y, 16, 16);
        break;
      case "bush":
        tile.status = "done";
        context.fillStyle = "#705f30";
        context.fillRect(0 + x, 0 + y, 16, 16);
        context.drawImage(tilesImage.element, 16 * (1 + tile.element), 16 * 1, 16, 16, 0 + x, 0 + y, 16, 16);
        modify(context, 0 + x, 0 + y, 16, 16);
        break;
      case "grass":
        context.fillStyle = "#705f30";
        context.fillRect(0 + x, 0 + y, 16, 16);

        if (tile.effect) {
          tile.type = 'block';
          tile.lock = 'true';
        } else if (tile.element == 1) {

          var tagetFlower = 0;
          if (animFlower > 0) {
            tagetFlower = (Math.floor(animFlower) * 16);
          }

          context.drawImage(tilesImage.element, 16 * tile.element + tagetFlower, 0, 16, 16, 0 + x, 0 + y, 16, 16);
        } else if (tile.element) {
          tile.status = "done";
          context.drawImage(tilesImage.element, 16 * tile.element, 0, 16, 16, 0 + x, 0 + y, 16, 16);
        }


        modify(context, 0 + x, 0 + y, 16, 16);
        break;
      default:
    }
  });

  animFlower += 0.08;
  if (animFlower > 3) {
    animFlower = -1;
  }
}
const modify = (context, x, y, width, height, effect = "forest") => {

  var contrast = 100;
  var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  var imgData = context.getImageData(x, y, width, height);

  var dark = {
    r: 0,
    g: 0,
    b: 0
  }; // rgba(0,0,0,1)
  var mid = {
    r: 0,
    g: 0,
    b: 0
  }; // rgba(0,0,0,1)
  var light = {
    r: 0,
    g: 0,
    b: 0
  }; // rgba(0,0,0,1)
  var lighter = {
    r: 0,
    g: 0,
    b: 0
  }; // rgba(0,0,0,1)

  switch (effect) {
    case "forest": // green
      dark = {
        r: 40,
        g: 104,
        b: 64
      }; // rgba(40,104,64,1)
      mid = {
        r: 64,
        g: 120,
        b: 64
      }; // rgba(64,120,64,1)
      light = {
        r: 72,
        g: 152,
        b: 72
      }; // rgba(72,152,72,1)
      lighter = {
        r: 176,
        g: 232,
        b: 184
      }; // rgba(176,232,184,1)
      break;
    case "ice": // blue
      dark = {
        r: 38,
        g: 97,
        b: 167
      }; // rgba(38,97,167,1)
      mid = {
        r: 84,
        g: 137,
        b: 225
      }; // rgba(84,137,225,1)
      light = {
        r: 54,
        g: 177,
        b: 236
      }; // rgba(54,177,236,1)
      lighter = {
        r: 129,
        g: 202,
        b: 236
      }; // rgba(129,202,236,1)
      break;
    case "desert": // yellow
      dark = {
        r: 72,
        g: 56,
        b: 40
      }; // rgba(72,56,40,1)
      mid = {
        r: 96,
        g: 72,
        b: 40
      }; // rgba(96,72,40,1)
      light = {
        r: 144,
        g: 128,
        b: 72
      }; // rgba(144,128,72,1)
      lighter = {
        r: 186,
        g: 188,
        b: 138
      }; // rgba(186,188,138,1)
      break;
    case "lava": // red
      dark = {
        r: 144,
        g: 24,
        b: 24
      }; // rgba(144,24,24,1)
      mid = {
        r: 224,
        g: 32,
        b: 32
      }; // rgba(224,32,32,1)
      light = {
        r: 248,
        g: 120,
        b: 32
      }; // rgba(248,120,32,1)
      lighter = {
        r: 247,
        g: 165,
        b: 110
      }; // rgba(247,165,110,1)
      break;
    case "grey": // grey

      dark = {
        r: 54,
        g: 54,
        b: 54
      }; // rgba(36,36,36,1)
      mid = {
        r: 73,
        g: 73,
        b: 73
      }; // rgba(73,73,73,1)
      light = {
        r: 93,
        g: 93,
        b: 93
      }; // rgba(93,93,93,1)
      lighter = {
        r: 150,
        g: 150,
        b: 150
      }; // rgba(150,150,150,1)
      break;

    default:
  }

  imgData = change(imgData, {
    r: 64,
    g: 55,
    b: 32
  }, dark); // rgba(64,55,32,1)
  imgData = change(imgData, {
    r: 95,
    g: 71,
    b: 32
  }, mid); // rgba(95,71,32,1)
  imgData = change(imgData, {
    r: 112,
    g: 95,
    b: 48
  }, light); // rgba(112,95,48,1)

  imgData = change(imgData, {
    r: 80,
    g: 128,
    b: 112
  }, light); // rgba(80,128,112,1)
  imgData = change(imgData, {
    r: 40,
    g: 120,
    b: 56
  }, mid); // rgba(40,120,56,1)
  imgData = change(imgData, {
    r: 72,
    g: 152,
    b: 72
  }, light); // rgba(72,152,72,1)
  imgData = change(imgData, {
    r: 176,
    g: 232,
    b: 184
  }, lighter); // rgba(176,232,184,1)

  context.putImageData(imgData, x, y);
}

const change = (imgData, startRGB, endRGB) => {
  var pixel = imgData.data;
  // invert colors
  var r = 0,
    g = 1,
    b = 2,
    a = 3;
  for (var p = 0; p < pixel.length; p += 4) {

    if (
      pixel[p + a] != 0 && // expect transparency
      pixel[p + r] == startRGB.r &&
      pixel[p + g] == startRGB.g &&
      pixel[p + b] == startRGB.b) { // black alpha 1
      pixel[p + r] = endRGB.r;
      pixel[p + g] = endRGB.g;
      pixel[p + b] = endRGB.b;
    }
  }
  return imgData;
}

module.exports = {
  reset: reset,
  init: init,
  initdraw: initdraw,
  calc: calc,
  display: display,
  getNear: getNear
}
