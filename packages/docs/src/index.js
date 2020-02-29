import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Paper from "@material-ui/core/Paper";
import {LoadingCircular} from "./component/LoadingCircular";
import Loadable from "react-loadable";
import AppTheme from "./lib/AppTheme";

const LoadingPageContainer = ({title}) => <AppTheme>
    <Paper style={{height: '100vh', margin: 0, padding: 24, display: 'flex', flexDirection: 'column', overflowX: 'auto'}}>
        <LoadingCircular title={title}/>
    </Paper>
</AppTheme>;

const App = Loadable({
    loader: () => import('./App'),
    loading: () => <LoadingPageContainer title={'Loading'}/>,
});

ReactDOM.render(<App/>, document.getElementById('root'));
