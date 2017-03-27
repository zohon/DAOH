import {
    createStore,
    combineReducers
} from 'redux'

import canvas_debug from './canvas_debug';
import canvas_background from './canvas_background';
import utils from './utils';

const speedinfo = 100; // pixel par seconde

const movement = (state = {
    x: 0,
    y: 0
}, action) => {

    var speed = speedinfo / 60;
    if (action.fps) {
        speed = speedinfo / action.fps;
    }

    var startState = { ...state};

    switch (action.type) {
        case 'move_up':
            state.y -= speed;
            break;
        case 'move_down':
            state.y += speed;
            break;
        case 'move_left':
            state.x -= speed;
            break;
        case 'move_right':
            state.x += speed;
            break;
        default:
    }

    console.log(state);
    var anti = anticipation(action.type, state);

    if(anti && anti.near && !anti.near.block) {
      return startState;
    }


    return state;
}

const anticipation = (type, target) => {

  if(!type) {
    return;
  }

  var anticipationX = 8;
  var anticipationY = 18;

  switch (type.toLowerCase()) {
      case 'up':
      case 'move_up':
          anticipationY-= 8;
          break;
      case 'down':
      case 'move_down':
          anticipationY+= 8;
          break;
      case 'move_left':
          anticipationX = -8;
          break;
      case 'move_right':
          anticipationX+= 8;
          break;
      default:
  }

  var params = {
    x : Math.round((target.x+anticipationX) /16)*16,
    y : Math.round((target.y+anticipationY) /16)*16,
    look : true
  };

  var near = canvas_background.getNear(params);

  if(false) {

    canvas_debug.debugContext.fillStyle = "rgba(0,255,0,0.5)";
    if(!near.block) {
      canvas_debug.debugContext.fillStyle = "rgba(255,0,0,0.5)";
    }

    canvas_debug.debugContext.clearRect(0,0,debug.width,debug.height);
    canvas_debug.debugContext.fillRect(
    Math.round((target.x+anticipationX) /16)*16,
    Math.round((target.y+anticipationY) /16)*16,
    16,
    16);

  }

  return {
    near : near,
    anticipate : params
  };
}

const action = (state = 0, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1
        case 'DECREMENT':
            return state - 1
        default:
            return state
    }
}

const animation = (state = {
    direction : "null",
    status : false
}, action) => {

    state.status = true;
    switch (action.type) {
        case 'move_up':
            state.direction = "up";
            return state;
        case 'move_down':
            state.direction = "down";
            return state;
        case 'move_left':
            state.direction = "left";
            return state;
        case 'move_right':
            state.direction = "right";
            return state;
        default:
            //state.direction = "";
            state.status = false;
            return state
    }
}

window.targetanimation = 0;
window.targetanimationpos = 0;
const draw = (context, target) => {

    // BODY
    var body = utils.getImage('media/body.png');

    if (body && body.status) {
        targetanimation += 8;
        //console.log(targetanimation % 32);

        if (targetanimation % 32 == 0) {
            targetanimationpos += 32;
            if (targetanimationpos > 96) {
                targetanimationpos = 0;
            }
        }

        var pos = 0;
        if (target.animation.direction == "right") {
            pos = 32;
        }
        if (target.animation.direction == "down") {
            pos = 64;
        }
        if (target.animation.direction == "up") {
            pos = 96;
        }

        if (!target.animation.status) {
          targetanimationpos =0;
        }
        context.drawImage(body.element, targetanimationpos, pos, 32, 32, target.position.x , target.position.y  + 7, 32, 32);
    }

    // Head
    var head = utils.getImage('media/head.png');

    if (head && head.status) {
        var pos = 0;
        var targetanimationposHead = targetanimationpos;
        if (target.animation.direction == "right") {
            pos = 32;
        }
        if (target.animation.direction == "down") {
            pos = 64;
            //targetanimationposHead = 0;
        }
        if (target.animation.direction == "up") {
            pos = 96;
            //targetanimationposHead = 0;
        }
        if (!target.animation.status) {
          targetanimationposHead =0;
        }
        context.drawImage(head.element, targetanimationposHead, pos, 32, 32, target.position.x , target.position.y , 32, 32);

    }

    shadow(context,target.position.x,target.position.y);

    return context;
}

const shadow = (context,x,y) => {
  var contrast = 100;
   var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  var imgData = context.getImageData(x, y, 32, 32);
  var pixel = imgData.data;
  // invert colors
  var r=0, g=1, b=2,a=3;
  for (var p = 0; p<pixel.length; p+=4)
  {

    if (
        pixel[p+r] == 255 &&
        pixel[p+g] == 255 &&
        pixel[p+b] == 255) // if white then change alpha to 0
    {
      //pixel[p+a] = 0;
    } else if(
        pixel[p+r] == 40 &&
        pixel[p+g] == 40 &&
        pixel[p+b] == 40){
      pixel[p+a] = 255;
    } else if(pixel[p+a] !=0){
      pixel[p+r] = 255;
      pixel[p+g] = 255;
      pixel[p+b] = 255;
            pixel[p+a] = 200;
    }
  }
  context.putImageData(imgData, x, y);
}


const events = combineReducers({
    position: movement,
    action: action,
    animation: animation
});

module.exports = {
    events: events,
    draw: draw
}
