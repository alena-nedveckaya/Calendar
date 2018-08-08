import {EventEmitter} from 'events';


let popupEvents=new EventEmitter();
popupEvents.setMaxListeners(1000);
const EVENT_CLOSE_POPUPS="EVENT_CLOSE_POPUPS"; // закрыть все выпадашки

export {popupEvents, EVENT_CLOSE_POPUPS}