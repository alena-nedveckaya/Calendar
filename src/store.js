import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from './reducers/reducers.js'


function _applyMiddleware() {
    const middleware=[

    ];
    return applyMiddleware(...middleware)
}

export default function configureStore(initialState) {
    const store = compose(_applyMiddleware())(createStore)(rootReducer, initialState + window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    return store
}
