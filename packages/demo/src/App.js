import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import {asyncComponent} from './component/AsyncComponent';

const MaterialUi = asyncComponent(() => import('./material-ui/material-ui'), 'Material-UI', 'page');
const MaterialUiPro = asyncComponent(() => import('./material-ui/material-ui-pro'), 'Material-UI Pro', 'page');
const MaterialUiDnd = asyncComponent(() => import('./material-ui/material-ui-dnd'), 'Material-UI DnD', 'page');
const MaterialUiDndGrid = asyncComponent(() => import('./material-ui/material-ui-dnd-grid'), 'Material-UI DnD Grid', 'page');
const MaterialUiEditorJS = asyncComponent(() => import('./material-ui/material-ui-editorjs'), 'Material-UI EditorJS', 'page');
const MaterialUiSlate = asyncComponent(() => import('./material-ui/material-ui-slate'), 'Material-UI Slate', 'page');
//const MaterialUiEditable = asyncComponent(() => import('./material-ui/material-ui-editable'), 'Material-UI Editable', 'page');
const MaterialUiCustom = asyncComponent(() => import('./material-ui/material-ui-custom'), 'Material-UI Custom', 'page');
const MaterialUiDebounced = asyncComponent(() => import('./material-ui/material-ui-debounced'), 'Material-UI Debounced', 'page');
const MaterialUiSplit = asyncComponent(() => import('./material-ui/material-ui-split'), 'Material-UI Split Schema', 'page');
const MaterialUiReadWrite = asyncComponent(() => import('./material-ui/material-ui-read-write'), 'Material-UI Read Write', 'page');
const Bootstrap = asyncComponent(() => import('./bootstrap/page-main'), 'Bootstrap', 'page');
const KitDnd = asyncComponent(() => import('./kit-dnd/page-dnd'), 'Kit DnD', 'page');
const KitDndGrid = asyncComponent(() => import('./kit-dnd/page-grid'), 'Kit DnD Kit', 'page');

const App = () => <Router>
    <Switch>
        <Route path="/mui-slate" component={MaterialUiSlate}/>
        <Route path="/mui-pro" component={MaterialUiPro}/>
        <Route path="/mui-editorjs" component={MaterialUiEditorJS}/>
        <Route path="/mui-dnd" component={MaterialUiDnd}/>
        <Route path="/mui-read-write" component={MaterialUiReadWrite}/>
        <Route path="/mui-dnd-grid" component={MaterialUiDndGrid}/>
        {/*<Route path="/mui-editable" component={MaterialUiEditable}/>*/}
        <Route path="/mui-custom" component={MaterialUiCustom}/>
        <Route path="/mui-debounced" component={MaterialUiDebounced}/>
        <Route path="/mui-split" component={MaterialUiSplit}/>
        <Route path="/bootstrap" component={Bootstrap}/>
        <Route path="/kit-dnd" component={KitDnd}/>
        <Route path="/kit-dnd-grid" component={KitDndGrid}/>
        <Route path="/" exact component={MaterialUi}/>
    </Switch>
</Router>;

export {App}
