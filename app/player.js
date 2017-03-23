import {
    createStore,
    combineReducers
} from 'redux'

import utils from './utils';

const speedinfo = 8; // pixel par seconde

const movement = (state = {
    x: 0,
    y: 0
}, action) => {

    var speed = speedinfo / 60;
    if (action.fps) {
        speed = speedinfo / action.fps;
    }

    switch (action.type) {
        case 'move_up':
            state.y -= speed;
            return state;
        case 'move_down':
            state.y += speed;
            return state;
        case 'move_left':
            state.x -= speed;
            return state;
        case 'move_right':
            state.x += speed;
            return state;
        default:
            return state
    }
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


window.library = [];


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
        context.drawImage(body.element, targetanimationpos, pos, 32, 32, target.position.x * 10, target.position.y * 10 + 7, 32, 32);

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

        context.drawImage(head.element, targetanimationposHead, pos, 32, 32, target.position.x * 10, target.position.y * 10, 32, 32);
    }

    return context;
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
