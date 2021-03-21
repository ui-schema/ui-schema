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
const MaterialUiPro = asyncComponent(() => import('./material-ui/material-ui-pro'), 'Material-UI Pro', 'page');
const MaterialUiRbd = asyncComponent(() => import('./material-ui/material-ui-rbd'), 'Material-UI RBD', 'page');
const MaterialUiDnd = asyncComponent(() => import('./material-ui/material-ui-dnd'), 'Material-UI DND', 'page');
const MaterialUiEditorJS = asyncComponent(() => import('./material-ui/material-ui-editorjs'), 'Material-UI EditorJS', 'page');
const MaterialUiSlate = asyncComponent(() => import('./material-ui/material-ui-slate'), 'Material-UI Slate', 'page');
const MaterialUiEditable = asyncComponent(() => import('./material-ui/material-ui-editable'), 'Material-UI Editable', 'page');
const Bootstrap = asyncComponent(() => import('./bootstrap/page-main'), 'Bootstrap', 'page');

const App = () => <Router>
    <Switch>
        <Route path="/mui-code" component={MaterialUiCode}/>
        <Route path="/mui-color" component={MaterialUiColor}/>
        <Route path="/mui-richtext" component={MaterialUiRich}/>
        <Route path="/mui-slate" component={MaterialUiSlate}/>
        <Route path="/mui-pickers" component={MaterialUiPickers}/>
        <Route path="/mui-pro" component={MaterialUiPro}/>
        <Route path="/mui-editorjs" component={MaterialUiEditorJS}/>
        <Route path="/mui-rbd" component={MaterialUiRbd}/>
        <Route path="/mui-dnd" component={MaterialUiDnd}/>
        <Route path="/mui-editable" component={MaterialUiEditable}/>
        <Route path="/bootstrap" component={Bootstrap}/>
        <Route path="/" exact component={MaterialUi}/>
    </Switch>
</Router>;

export {App}
