import {
    createStore,
    combineReducers
} from 'redux'

const movement = (state = {
    up: false,
    down: false,
    left: false,
    right: false
}, action) => {
    switch (action.type) {
        case 'UP':
            if (action.action) {
                return { ...state,
                    up: false
                };
            }
            return { ...state,
                up: true
            };
        case 'DOWN':
            if (action.action) {
                return { ...state,
                    down : false
                };
            }
            return { ...state,
                down : true
            };
            return state;
        case 'LEFT':
            if (action.action) {
                return { ...state,
                    left : false
                };
            }
            return { ...state,
              left : true
            };
            return state;
        case 'RIGHT':
            if (action.action) {
                return { ...state,
                    right : false
                };
            }
            return { ...state,
                right : true
            };
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

const events = combineReducers({
    position: movement,
    action: action
});

module.exports = {
    events: events
}
