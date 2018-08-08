import {combineReducers} from  'redux';
import {routerReducer} from 'react-router-redux';
import modalReducer from './modal_reducers'

export default combineReducers({
    routing: routerReducer,
    ...modalReducer
})