import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import {asyncComponent} from "./component/AsyncComponent";

const MaterialUi = asyncComponent(() => import('./material-ui/material-ui'), 'Material-UI', 'page');
const MaterialUiCode = asyncComponent(() => import('./material-ui/material-ui-code'), 'Material-UI Code', 'page');
const MaterialUiColor = asyncComponent(() => import('./material-ui/material-ui-color'), 'Material-UI Color', 'page');
const MaterialUiRich = asyncComponent(() => import('./material-ui/material-ui-rich'), 'Material-UI Rich Text', 'page');
const MaterialUiPickers = asyncComponent(() => import('./material-ui/material-ui-pickers'), 'Material-UI Pickers', 'page');
const Bootstrap = asyncComponent(() => import('./pages/bootstrap').then(module => module.Bootstrap), 'Bootstrap', 'page');
const Blueprint = asyncComponent(() => import('./blueprint/page-main'), 'Blueprint', 'page');
const Ant = asyncComponent(() => import('./antd/page-main'), 'AntD', 'page');
const Semantic = asyncComponent(() => import('./semanticui/page-main'), 'Semantic UI', 'page');
const ThemeUI = asyncComponent(() => import('./themeui/page-main'), 'Theme UI', 'page');

const App = () => <Router>
    <Switch>
        <Route path="/mui-code" component={MaterialUiCode}/>
        <Route path="/mui-color" component={MaterialUiColor}/>
        <Route path="/mui-richtext" component={MaterialUiRich}/>
        <Route path="/mui-pickers" component={MaterialUiPickers}/>
        <Route path="/bootstrap" component={Bootstrap}/>
        <Route path="/blueprint" component={Blueprint}/>
        <Route path="/antd" component={Ant}/>
        <Route path="/semantic-ui" component={Semantic}/>
        <Route path="/theme-ui" component={ThemeUI}/>
        <Route path="/" exact component={MaterialUi}/>
    </Switch>
</Router>;

export {App}
