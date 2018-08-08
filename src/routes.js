import React from 'react';
import {Route} from 'react-router'
import TestComponent from "../components/TestComponent";

export default (
    <Route component={TestComponent} path={TestComponent.path}></Route>
)