import {
    createStore,
    combineReducers
} from 'redux'


import expect from 'expect'
import deepFreeze from "deep-freeze"
import canvas_main from './canvas_main';
import canvas_background from './canvas_background';
import player from './player';
import controls from './controls';

const todoApp = combineReducers({
    player: player.events,
    controls: controls.events
})



// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(todoApp);

// You can use subscribe() to update the UI in response to state changes.
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
// However it can also be handy to persist the current state in the localStorage.
const render = () => {
    //console.log(store.getState());
    // document.getElementById("counter").innerHTML = "up "+store.getState().controls.movement.up+"<br>down "+store.getState().controls.movement.down;
    // document.getElementById("action").innerHTML = "left "+store.getState().controls.movement.left+"<br>right "+store.getState().controls.movement.right;
}

store.subscribe(render);
render();

const context_main = canvas_main.init();
canvas_main.initdraw(function(fps) {

    if (store.getState().controls.movement.north) {
        store.dispatch({
            type: 'move_north',
            fps: fps
        });
    }
    if (store.getState().controls.movement.south) {
        store.dispatch({
            type: 'move_south',
            fps: fps
        });
    }
    if (store.getState().controls.movement.west) {
        store.dispatch({
            type: 'move_west',
            fps: fps
        });
    }
    if (store.getState().controls.movement.east) {
        store.dispatch({
            type: 'move_east',
            fps: fps
        });
    }

    canvas_main.display(store);
    //canvas.reset();
});

const context_background = canvas_background.init();
canvas_background.initdraw(function(fps) {
    canvas_background.display(store);
    //canvas.reset();
});


//listener

document.onkeydown = function(e) {
    e = e || window.event;
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    if (charCode) {

        if (charCode == 17) {
            window.keydown = "ctrl";
            return;
        }

        //console.log("Character typed :", String.fromCharCode(charCode), charCode);
        switch (String.fromCharCode(charCode).toLowerCase()) {
            case " ":
                store.dispatch({
                    type: 'attack'
                });
                break;
            case "&":
            case "z":
                store.dispatch({
                    type: 'north'
                });
                break;
            case "(":
            case "s":
                store.dispatch({
                    type: 'south'
                });
                break;
            case "%":
            case "q":
                store.dispatch({
                    type: 'west'
                });
                break;
            case "'":
            case "d":
                store.dispatch({
                    type: 'east'
                });
                break;
            default:

        }
    }
};

document.onkeyup = function(e) {
    e = e || window.event;
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    if (charCode) {
        //console.log("Character typed: " + String.fromCharCode(charCode));

        if (charCode == 17) {
            window.keydown = "";
            return;
        }

        switch (String.fromCharCode(charCode).toLowerCase()) {
            case "&":
            case "z":
                store.dispatch({
                    type: 'north',
                    action: 'remove'
                });
                break;
            case "(":
            case "s":
                store.dispatch({
                    type: 'south',
                    action: 'remove'
                });
                break;
            case "%":
            case "q":
                store.dispatch({
                    type: 'west',
                    action: 'remove'
                });
                break;
            case "'":
            case "d":
                store.dispatch({
                    type: 'east',
                    action: 'remove'
                });
                break;
            default:

        }
    }
};



//
// const testcounter = () => {
//     const countBefore = 0;
//     const countAfter = 1;
//     deepFreeze(countBefore);
//     expect(
//       counter(countBefore, {type : "INCREMENT"})
//     ).toEqual(countAfter)
// }
//
// const testaction = () => {
//     const actionBefore = 0;
//     const actionAfter = 1;
//     deepFreeze(actionBefore);
//     expect(
//       action(actionBefore, {type : "INCREMENT"})
//     ).toEqual(actionAfter)
// }
//
// testcounter();
// testaction();
// console.log("all tests passed.");
