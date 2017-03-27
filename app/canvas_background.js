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

    return context;
}

const createBlock = (datas) => {

    var block = _.find(map, {
        'x': datas.x,
        'y': datas.y
    });

    getNear({
        x: datas.x,
        y: datas.y
    });

    if (!block) {
        map.push({
            x: datas.x,
            y: datas.y,
            type: "block",
            status: "new"
        });
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
    /*
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {

                var block = {
                    x: i * 16,
                    y: j * 16,
                };

                if (i == 0 || j == 0 || i == width - 1 || j == width - 1) {
                    block = { ...block,
                        type: 'block',
                        element: 1
                    };
                } else if (j == Math.floor(Math.random() * 36) || i == Math.floor(Math.random() * 36)) {

                    block = { ...block,
                        type: 'bush',
                        element: 0
                    };
                } else {
                    var element = Math.random() * 10;
                    block = { ...block,
                        type: 'grass',
                        element: (element >= 7 ? (element >= 9 ? 1 : (Math.random() * 10 >= 6 ? 6 : 4)) : 0)
                    };
                }
                map.push(block);
            }
        }*/
    console.log(map);
}

const initdraw = (animate) => {
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    const draw = () => {
        var infosFps = calcFPS();
        animate(infosFps);
        requestAnimationFrame(draw);
    }
    generateLevel();
    var infosFps = calcFPS();
    animate(infosFps);
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
            createBlock({
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
            createBlock({
                x: backgroundMouse.x,
                y: newY
            });

        }

    }
    lastbackgroundMouse = backgroundMouse;
    createBlock(backgroundMouse);
}


const display = (store) => {
    //reset();

    if (!mousedown) {
        lastbackgroundMouse = {};
        return;
    }

    if (backgroundMouse && mousedown) {
        mouseAction();
    }

    context.imageSmoothingEnabled = false;

    var litenMap = _.filter(map, function(o) {

        return o.status != 'done';
    });

    _.each(litenMap, function(tile, tilesIndex) {

        var x = tile.x;
        var y = tile.y;

        tile.status = "done";
        context.clearRect(0 + x, 0 + y, 16, 16);

        switch (tile.type) {
            case "block":
                //context.fillStyle = "#d0c090";

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
                if (blockNorth && blockNorth.type == "block") {
                    arryPresent.push("N");
                }
                if (blockEast && blockEast.type == "block") {
                    arryPresent.push("E");
                }
                if (blockSouth && blockSouth.type == "block") {
                    arryPresent.push("S");
                }
                if (blockWest && blockWest.type == "block") {
                    arryPresent.push("W");
                }

                // all block
                if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W"].sort())) {

                    if (blockNorthWest && blockNorthWest.type == "block") {
                        arryPresent.push("NW");
                    }
                    if (blockNorthEast && blockNorthEast.type == "block") {
                        arryPresent.push("NE");
                    }
                    if (blockSouthWest && blockSouthWest.type == "block") {
                        arryPresent.push("SW");
                    }
                    if (blockSouthEast && blockSouthEast.type == "block") {
                        arryPresent.push("SE");
                    }


                    if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W", "NE", "SE", "SW"].sort())) {
                        context.drawImage(tilesImage.element, 16 * 7, 16 * 3, 16, 16, 0 + x, 0 + y, 16, 16);
                        shadow(context, 0 + x, 0 + y, 16, 16);
                        return;
                    }

                    if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W", "NW", "SE", "SW"].sort())) {
                        context.drawImage(tilesImage.element, 16 * 6, 16 * 3, 16, 16, 0 + x, 0 + y, 16, 16);
                        shadow(context, 0 + x, 0 + y, 16, 16);
                        return;
                    }

                    if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W", "NW", "NE", "SE"].sort())) {
                        context.drawImage(tilesImage.element, 16 * 7, 16 * 2, 16, 16, 0 + x, 0 + y, 16, 16);
                        shadow(context, 0 + x, 0 + y, 16, 16);
                        return;
                    }

                    if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W", "NW", "NE", "SW"].sort())) {
                        context.drawImage(tilesImage.element, 16 * 6, 16 * 2, 16, 16, 0 + x, 0 + y, 16, 16);
                        shadow(context, 0 + x, 0 + y, 16, 16);
                        return;
                    }

                    if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W", "SE", "SW"].sort())) {
                        context.drawImage(tilesImage.element, 16 * 6, 16 * 6, 16, 16, 0 + x, 0 + y, 16, 16);
                        shadow(context, 0 + x, 0 + y, 16, 16);
                        return;
                    }

                    if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W", "NE", "NW"].sort())) {
                        context.drawImage(tilesImage.element, 16 * 6, 16 * 7, 16, 16, 0 + x, 0 + y, 16, 16);
                        shadow(context, 0 + x, 0 + y, 16, 16);
                        return;
                    }


                    if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W", "NW", "SW"].sort())) {
                        context.drawImage(tilesImage.element, 16 * 7, 16 * 6, 16, 16, 0 + x, 0 + y, 16, 16);
                        shadow(context, 0 + x, 0 + y, 16, 16);
                        return;
                    }

                    if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W", "NE", "SE"].sort())) {
                        context.drawImage(tilesImage.element, 16 * 7, 16 * 7, 16, 16, 0 + x, 0 + y, 16, 16);
                        shadow(context, 0 + x, 0 + y, 16, 16);
                        return;
                    }


                    if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W", "NE", "SW"].sort())) {
                        context.drawImage(tilesImage.element, 16 * 7, 16 * 1, 16, 16, 0 + x, 0 + y, 16, 16);
                        shadow(context, 0 + x, 0 + y, 16, 16);
                        return;
                    }

                    if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W", "NW", "SE"].sort())) {
                        context.drawImage(tilesImage.element, 16 * 6, 16 * 1, 16, 16, 0 + x, 0 + y, 16, 16);
                        shadow(context, 0 + x, 0 + y, 16, 16);
                        return;
                    }

                    if (_.isEqual(arryPresent.sort(), ["N", "E", "S", "W"].sort())) {
                        context.drawImage(tilesImage.element, 16 * 5, 16 * 1, 16, 16, 0 + x, 0 + y, 16, 16);
                        shadow(context, 0 + x, 0 + y, 16, 16);
                        return;
                    }

                    context.fillStyle = "#705f30";
                    context.fillRect(0 + x, 0 + y, 16, 16);
                    shadow(context, 0 + x, 0 + y, 16, 16);
                    return;
                }


                // no block
                if (arryPresent.length == 0) {
                    context.drawImage(tilesImage.element, 16 * 3, 16 * 6, 16, 16, 0 + x, 0 + y, 16, 16);
                    shadow(context, 0 + x, 0 + y, 16, 16);
                    return;
                }

                if (_.isEqual(arryPresent.sort(), ["N"].sort())) {
                    context.drawImage(tilesImage.element, 16 * 4, 16 * 7, 16, 16, 0 + x, 0 + y, 16, 16);
                    shadow(context, 0 + x, 0 + y, 16, 16);
                    return;
                }

                if (_.isEqual(arryPresent.sort(), ["N", "W", "E"].sort())) {
                    context.drawImage(tilesImage.element, 16 * 4, 16 * 3, 16, 16, 0 + x, 0 + y, 16, 16);
                    shadow(context, 0 + x, 0 + y, 16, 16);
                    return;
                }

                if (_.isEqual(arryPresent.sort(), ["N", "E"].sort())) {
                    context.drawImage(tilesImage.element, 16 * 2, 16 * 5, 16, 16, 0 + x, 0 + y, 16, 16);
                    shadow(context, 0 + x, 0 + y, 16, 16);
                    return;
                }

                if (_.isEqual(arryPresent.sort(), ["N", "W"].sort())) {
                    context.drawImage(tilesImage.element, 16 * 3, 16 * 5, 16, 16, 0 + x, 0 + y, 16, 16);
                    shadow(context, 0 + x, 0 + y, 16, 16);
                    return;
                }

                if (_.isEqual(arryPresent.sort(), ["S"].sort())) {
                    context.drawImage(tilesImage.element, 16 * 5, 16 * 7, 16, 16, 0 + x, 0 + y, 16, 16);
                    shadow(context, 0 + x, 0 + y, 16, 16);
                    return;
                }


                if (_.isEqual(arryPresent.sort(), ["S", "W", "E"].sort())) {
                    context.drawImage(tilesImage.element, 16 * 4, 16 * 2, 16, 16, 0 + x, 0 + y, 16, 16);
                    shadow(context, 0 + x, 0 + y, 16, 16);
                    return;
                }

                if (_.isEqual(arryPresent.sort(), ["S", "E"].sort())) {
                    context.drawImage(tilesImage.element, 16 * 2, 16 * 4, 16, 16, 0 + x, 0 + y, 16, 16);
                    shadow(context, 0 + x, 0 + y, 16, 16);
                    return;
                }

                if (_.isEqual(arryPresent.sort(), ["S", "W"].sort())) {
                    context.drawImage(tilesImage.element, 16 * 3, 16 * 4, 16, 16, 0 + x, 0 + y, 16, 16);
                    shadow(context, 0 + x, 0 + y, 16, 16);
                    return;
                }

                if (_.isEqual(arryPresent.sort(), ["S", "N"].sort())) {
                    context.drawImage(tilesImage.element, 16 * 6, 16 * 4, 16, 16, 0 + x, 0 + y, 16, 16);
                    shadow(context, 0 + x, 0 + y, 16, 16);
                    return;
                }

                if (_.isEqual(arryPresent.sort(), ["W"].sort())) {
                    context.drawImage(tilesImage.element, 16 * 4, 16 * 6, 16, 16, 0 + x, 0 + y, 16, 16);
                    shadow(context, 0 + x, 0 + y, 16, 16);
                    return;
                }

                if (_.isEqual(arryPresent.sort(), ["W", "N", "S"].sort())) {
                    context.drawImage(tilesImage.element, 16 * 5, 16 * 2, 16, 16, 0 + x, 0 + y, 16, 16);
                    shadow(context, 0 + x, 0 + y, 16, 16);
                    return;
                }

                if (_.isEqual(arryPresent.sort(), ["E", "N", "S"].sort())) {
                    context.drawImage(tilesImage.element, 16 * 5, 16 * 3, 16, 16, 0 + x, 0 + y, 16, 16);
                    shadow(context, 0 + x, 0 + y, 16, 16);
                    return;
                }

                if (_.isEqual(arryPresent.sort(), ["E"].sort())) {
                    context.drawImage(tilesImage.element, 16 * 5, 16 * 6, 16, 16, 0 + x, 0 + y, 16, 16);
                    shadow(context, 0 + x, 0 + y, 16, 16);
                    return;
                }

                if (_.isEqual(arryPresent.sort(), ["W", "E"].sort())) {
                    context.drawImage(tilesImage.element, 16 * 7, 16 * 4, 16, 16, 0 + x, 0 + y, 16, 16);
                    shadow(context, 0 + x, 0 + y, 16, 16);
                    return;
                }

                context.fillStyle = "#705f30";
                context.fillRect(0 + x, 0 + y, 16, 16);
                shadow(context, 0 + x, 0 + y, 16, 16);

                break;
            case "bush":
                context.fillStyle = "#409740";
                context.fillRect(0 + x, 0 + y, 16, 16);
                context.drawImage(tilesImage.element, 16 * (1 + tile.element), 16 * 1, 16, 16, 0 + x, 0 + y, 16, 16);

                break;
            case "grass":
                context.fillStyle = "#409740";
                context.fillRect(0 + x, 0 + y, 16, 16);
                if (tile.element == 1) {

                    var tagetFlower = 0;
                    if (animFlower > 0) {
                        tagetFlower = (Math.floor(animFlower) * 16);
                    }

                    context.drawImage(tilesImage.element, 16 * tile.element + tagetFlower, 0, 16, 16, 0 + x, 0 + y, 16, 16);

                } else if (tile.element) {
                    context.drawImage(tilesImage.element, 16 * tile.element, 0, 16, 16, 0 + x, 0 + y, 16, 16);
                }

                break;
            default:
        }
    });

    animFlower += 0.08;
    if (animFlower > 3) {
        animFlower = -1;
    }
}

const shadow = (context, x = 0, y = 0, width = 16, height = 16) => {
    var contrast = 100;
    var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    var imgData = context.getImageData(x, y, width, height);
    var pixel = imgData.data;
    // invert colors
    var r = 0,
        g = 1,
        b = 2,
        a = 3;
    for (var p = 0; p < pixel.length; p += 4) {
        if (pixel[p + r] == 255 &&
            pixel[p + g] == 255 &&
            pixel[p + b] == 255) {// if white then change alpha to 0
            pixel[p + a] = 0;

          }
        // } else if (
        //     pixel[p + r] == 32 &&
        //     pixel[p + g] == 39 &&
        //     pixel[p + b] == 32) {
        //     pixel[p + a] = 255;
        // }
        else  {
            pixel[p + g] = pixel[p + r] / 200 * 255;
        }
    }
    context.putImageData(imgData, x, y);
}
module.exports = {
    reset: reset,
    init: init,
    initdraw: initdraw,
    calc: calc,
    display: display,
    getNear: getNear
}
