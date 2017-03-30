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
        case 'north':
            if (action.action) {
                return { ...state,
                    north: false
                };
            }
            return { ...state,
                north: true
            };
        case 'south':
            if (action.action) {
                return { ...state,
                    south : false
                };
            }
            return { ...state,
                south : true
            };
            return state;
        case 'west':
            if (action.action) {
                return { ...state,
                    west : false
                };
            }
            return { ...state,
              west : true
            };
            return state;
        case 'east':
            if (action.action) {
                return { ...state,
                    east : false
                };
            }
            return { ...state,
                east : true
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
    movement,
    action
});

module.exports = {
    events: events
}
