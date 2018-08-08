
import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './src/store';
import {Router, browserHistory} from 'react-router'
import { syncHistoryWithStore} from 'react-router-redux'
import {Provider} from 'react-redux'
import routes from './src/routes'

import TestComponent from './components/TestComponent';

// если необходимо, вид сборки можно проверить в коде:
// if (process.env.NODE_ENV === 'production') {
// if (process.env.NODE_ENV !== 'production') {

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);


ReactDOM.render(

    <Provider store = {store}>
        <Router history={history}>
        {routes}
        </Router>
    </Provider>

  // <TestComponent />
, document.getElementById('container') );
