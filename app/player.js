import {
    createStore,
    combineReducers
} from 'redux'

import canvas_debug from './canvas_debug';
import canvas_background from './canvas_background';
import utils from './utils';

const speedinfo = 100; // pixel par seconde


const listenaction = (state, action) => {


    switch (action.type) {
        case 'attack':
            state = { ...state,
              animation : { ...state.animation,
                type : 'attack',
                duration : 2
              }
            };
            var anti = anticipation(action.type, state.movement);
            if(state.animation.direction) {
              var direction = state.animation.direction

              var targetBlock = 'block'+direction.charAt(0).toUpperCase() + direction.slice(1);
              if (state.animation && state.animation.direction && anti && anti.near && anti.near[targetBlock]) {
                  switch (anti.near[targetBlock].type) {
                    case "bush":
                      anti.near[targetBlock].solid = false;
                      anti.near[targetBlock].element = 1;
                      anti.near[targetBlock].status = "update";
                      break;
                    default:
                  }
              }

            }
            break;
        case 'defend':
            break;
        case 'dodge':
            break;
        default:
    }

    if (state) {
        return state;
    }


}


const events = (state = {
    movement : {
      x: 0,
      y: 0
    },
    animation : {
      direction: "null",
      status: false
    }
}, action) => {

    var state = { ...state,
      animation : animation(state.animation, action),
    };

    if(!state.animation.type) {
      var state = { ...state,
        movement : movement(state.movement, action)
      };
    }

    state = listenaction(state, action);

    return state;

}

const movement = (state = {
    x: 0,
    y: 0
}, action) => {

        var speed = speedinfo / 60;
        if (action.fps) {
            if(action.fps < 30) {
              action.fps = 30;
            }
            speed = speedinfo / action.fps;
        }

        var startState = { ...state};

        if (action.type) {
            switch (action.type) {
                case 'move_north':
                    state = { ...state,
                        y: state.y - speed
                    };
                    //state.y -= speed;
                    break;
                case 'move_south':
                    state = { ...state,
                        y: state.y + speed
                    };
                    break;
                case 'move_west':
                    state = { ...state,
                        x: state.x - speed
                    };
                    break;
                case 'move_east':
                    state = { ...state,
                        x: state.x + speed
                    };
                    break;
                default:
            }
        }

        var anti = anticipation(action.type, state);

        if (anti && anti.near && (!anti.near.block || anti.near.block.solid)) {
            return startState;
        }

        return state;
}

const animation = (state = {
    direction: "null",
    status: false
}, action) => {

    state.status = true;
    switch (action.type) {
        case 'move_north':
            return { ...state,
                direction: "north",
                status: true
            };
        case 'move_south':
            return { ...state,
                direction: "south",
                status: true
            };
        case 'move_west':
            return { ...state,
                direction: "west",
                status: true
            };
        case 'move_east':
            return { ...state,
                direction: "east",
                status: true
            };
        default:
            return { ...state,
                status: "false"
            };
    }
}

const anticipation = (type, target) => {

    if (!type) {
        return;
    }

    var anticipationX = 6;
    var anticipationY = 16;

    if (type) {
        switch (type.toLowerCase()) {
            case 'north':
            case 'move_north':
                anticipationY -= 8;
                break;
            case 'south':
            case 'move_south':
                anticipationY += 8;
                break;
            case 'west':
            case 'move_west':
                anticipationX = -2;
                break;
            case 'east':
            case 'move_east':
                anticipationX += 8;
                break;
            default:
        }
    }

    var params = {
        x: Math.round((target.x + anticipationX) / 16) * 16,
        y: Math.round((target.y + anticipationY) / 16) * 16,
        look: true
    };

    var near = canvas_background.getNear(params);

    if (false) {
        canvas_debug.debugContext.clearRect(0, 0, debug.width, debug.height);
        canvas_debug.debugContext.fillStyle = "rgba(0,255,0,0.5)";
        if (!near.block || near.block.type == 'bush') {
            canvas_debug.debugContext.fillStyle = "rgba(255,0,0,0.5)";
        }

        canvas_debug.debugContext.fillRect(
            params.x,
            params.y,
            16,
            16);
    }

    return {
        near: near,
        anticipate: params
    };
}



window.targetanimation = 0;
window.targetanimationpos = 0;
const draw = (context, target) => {

    // BODY
    var body = utils.getImage('media/body.png');

    if (body && body.status) {
        targetanimation += 8;

        if (targetanimation % 32 == 0) {
            targetanimationpos += 32;
            if (targetanimationpos > 96) {
                targetanimationpos = 0;
            }
        }

        var pos = 0;
        if (target.animation.direction == "east") {
            pos = 32;
        }
        if (target.animation.direction == "south") {
            pos = 64;
        }
        if (target.animation.direction == "north") {
            pos = 96;
        }

        if (target.animation.status == "false") {
            targetanimationpos = 0;
        }
        context.drawImage(body.element, targetanimationpos, pos, 32, 32, target.movement.x, target.movement.y + 7, 32, 32);
    }

    // Head
    var head = utils.getImage('media/head.png');

    if (head && head.status) {
        var pos = 0;
        var targetanimationposHead = targetanimationpos;
        if (target.animation.direction == "east") {
            pos = 32;
        }
        if (target.animation.direction == "south") {
            pos = 64;
            //targetanimationposHead = 0;
        }
        if (target.animation.direction == "north") {
            pos = 96;
            //targetanimationposHead = 0;
        }
        if (target.animation.status == "false") {
            targetanimationposHead = 0;
        }
        context.drawImage(head.element, targetanimationposHead, pos, 32, 32, target.movement.x, target.movement.y, 32, 32);

    }

    // action
    if(target.animation.type && target.animation.duration) {
      console.log(target.animation.type);

      var posX = 8;
      var posY = 16;

      switch (target.animation.type) {
        case "attack":
        context.fillStyle = "rgba(0,255,0,0.5)";
        target.animation.duration -= 0.1;
        if(target.animation.duration < 0) {
          target.animation.duration = 0;
          target.animation.type = null;
        }
        switch (target.animation.direction) {
            case "north":
                posY -= 16;
            break;
            case "south":
                posY += 16;
            break;
            case "west":
                posX -= 16;
            break;
            case "east":
                posX += 16;
            break;
          default:

        }
        context.fillRect(
            target.movement.x+posX,
            target.movement.y+posY,
            16,
            16);
          break;
        default:
      }
    }

    modify(context, target.movement.x, target.movement.y);

    return context;
}

const modify = (context, x, y) => {
    var contrast = 100;
    var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    var imgData = context.getImageData(x, y, 32, 32);
    //imgData = fufu(imgData);

    imgData = change(imgData, {
        r: 236,
        g: 96,
        b: 180
    }, {
        r: 234,
        g: 192,
        b: 67
    }); // air rgba(236,96,180,1) rgba(234,192,67,1)
    imgData = change(imgData, {
        r: 255,
        g: 120,
        b: 0
    }, {
        r: 234,
        g: 192,
        b: 67
    }); // air rgba(255,120,0,1) rgba(234,192,67,1)

    // blue

    var darkblue = {
        r: 38,
        g: 97,
        b: 167
    }; // rgba(38,97,167,1)
    var lightblue = {
        r: 54,
        g: 177,
        b: 236
    }; // rgba(54,177,236,1)
    //
    // imgData = change(imgData, {r : 80,g : 144,b: 16}, darkblue); // rgba(80,144,16,1)
    // imgData = change(imgData, {r : 140,g : 88,b: 40}, darkblue); // rgba(140,88,40,1)
    // imgData = change(imgData, {r : 120,g : 184,b: 32}, lightblue); // rgba(120,184,32,1)

    // red
    var darkred = {
        r: 187,
        g: 4,
        b: 38
    }; // rgba(187,4,38,1)
    var lightred = {
        r: 245,
        g: 88,
        b: 140
    }; // rgba(245,88,140,1)

    imgData = change(imgData, {
        r: 80,
        g: 144,
        b: 16
    }, darkred); // rgba(80,144,16,1)
    imgData = change(imgData, {
        r: 140,
        g: 88,
        b: 40
    }, darkred); // rgba(140,88,40,1)
    imgData = change(imgData, {
        r: 120,
        g: 184,
        b: 32
    }, lightred); // rgba(120,184,32,1)


    context.putImageData(imgData, x, y);
}

const fufu = (imgData) => {
    var pixel = imgData.data;
    // invert colors
    var r = 0,
        g = 1,
        b = 2,
        a = 3;
    for (var p = 0; p < pixel.length; p += 4) {
        if (
            pixel[p + r] == 40 &&
            pixel[p + g] == 40 &&
            pixel[p + b] == 40) { // black alpha 1
            pixel[p + a] = 255;
        } else if (pixel[p + a] != 0) { // all expect transparency go to white
            pixel[p + r] = 255;
            pixel[p + g] = 255;
            pixel[p + b] = 255;
            pixel[p + a] = 200;
        }
    }
    return imgData;
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



// const events = combineReducers({
//     // listenaction,
//     position: movement,
//     animation: animation
// });

module.exports = {
    events: events,
    draw: draw
}
