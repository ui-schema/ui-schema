import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import {asyncComponent} from "./component/AsyncComponent";

const MaterialUi = asyncComponent(() => import('./pages/material-ui').then(module => module.MaterialUi), 'Material-UI', 'page');
const Bootstrap = asyncComponent(() => import('./pages/bootstrap').then(module => module.Bootstrap), 'Bootstrap', 'page');

const App = () => <Router>
    <Switch>
        <Route path="/pulse">
            <h1>Pulse</h1>
        </Route>
        <Route path="/ant">
            <h1>Ant</h1>
        </Route>
        <Route path="/bootstrap" component={Bootstrap}/>
        <Route path="/" exact component={MaterialUi}/>
    </Switch>
</Router>;

export {App}
