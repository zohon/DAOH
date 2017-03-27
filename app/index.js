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
    controls : controls.events
})



// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(todoApp);

// You can use subscribe() to update the UI in response to state changes.
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
// However it can also be handy to persist the current state in the localStorage.
const render = () => {
    //console.log(store.getState());
    // document.getElementById("counter").innerHTML = "up "+store.getState().controls.position.up+"<br>down "+store.getState().controls.position.down;
    // document.getElementById("action").innerHTML = "left "+store.getState().controls.position.left+"<br>right "+store.getState().controls.position.right;
}

store.subscribe(render);
render();

const context_main = canvas_main.init();
canvas_main.initdraw(function(fps) {

  if(store.getState().controls.position.up) {
    store.dispatch({ type: 'move_up', fps : fps });
  }
  if(store.getState().controls.position.down) {
    store.dispatch({ type: 'move_down', fps : fps });
  }
  if(store.getState().controls.position.left) {
    store.dispatch({ type: 'move_left', fps : fps });
  }
  if(store.getState().controls.position.right) {
    store.dispatch({ type: 'move_right', fps : fps });
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

        if(charCode == 17) {
          window.keydown = "ctrl";
          return;
        }

        //console.log("Character typed :", String.fromCharCode(charCode),charCode);
        switch (String.fromCharCode(charCode).toLowerCase()) {
            case "&":
            case "z":
                store.dispatch({
                    type: 'UP'
                });
                break;
            case "(":
            case "s":
                store.dispatch({
                    type: 'DOWN'
                });
                break;
            case "%":
            case "q":
                store.dispatch({
                    type: 'LEFT'
                });
                break;
            case "'":
            case "d":
                store.dispatch({
                    type: 'RIGHT'
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

        if(charCode == 17) {
          window.keydown = "";
          return;
        }

        switch (String.fromCharCode(charCode).toLowerCase()) {
            case "&":
            case "z":
                store.dispatch({
                    type: 'UP',
                    action : 'remove'
                });
                break;
            case "(":
            case "s":
                store.dispatch({
                    type: 'DOWN',
                    action : 'remove'
                });
                break;
            case "%":
            case "q":
                store.dispatch({
                    type: 'LEFT',
                    action : 'remove'
                });
                break;
            case "'":
            case "d":
                store.dispatch({
                    type: 'RIGHT',
                    action : 'remove'
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
