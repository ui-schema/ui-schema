import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import {MaterialUi} from './pages/material-ui';

const App = () => <Router>
    <Switch>
        <Route path="/pulse">
            <h1>Pulse</h1>
        </Route>
        <Route path="/ant">
            <h1>Ant</h1>
        </Route>
        <Route path="/bootstrap">
            <h1>Bootstrap</h1>
        </Route>
        <Route path="/">
            <MaterialUi/>
        </Route>
    </Switch>
</Router>;

export {App}
