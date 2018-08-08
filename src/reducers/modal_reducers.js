import {OPEN_MODAL, CLOSE_MODAL} from '../actions/Modal_actions';

const initialState = {
    isOpen :false
};
function modalReducer (state = initialState,action) {
    switch (action.type) {
        case OPEN_MODAL:
            return{...state, isOpen:true};
        case CLOSE_MODAL:
            return {...state, isOpen:false};
        default:
            return state;
    }
}
const ModalReducer = {
    modal: modalReducer
};
export default ModalReducer