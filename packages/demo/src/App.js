import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import {asyncComponent} from "./component/AsyncComponent";

const MaterialUi = asyncComponent(() => import('./pages/material-ui'), 'Material-UI', 'page');
const MaterialUiCode = asyncComponent(() => import('./pages/material-ui-code'), 'Material-UI Code', 'page');
const MaterialUiRich = asyncComponent(() => import('./pages/material-ui-rich'), 'Material-UI Rich Text', 'page');
const MaterialUiPickers = asyncComponent(() => import('./pages/material-ui-pickers'), 'Material-UI Pickers', 'page');
const Bootstrap = asyncComponent(() => import('./pages/bootstrap').then(module => module.Bootstrap), 'Bootstrap', 'page');

const App = () => <Router>
    <Switch>
        <Route path="/pulse">
            <h1>Pulse</h1>
        </Route>
        <Route path="/ant">
            <h1>Ant</h1>
        </Route>
        <Route path="/mui-code" component={MaterialUiCode}/>
        <Route path="/mui-richtext" component={MaterialUiRich}/>
        <Route path="/mui-pickers" component={MaterialUiPickers}/>
        <Route path="/bootstrap" component={Bootstrap}/>
        <Route path="/" exact component={MaterialUi}/>
    </Switch>
</Router>;

export {App}
