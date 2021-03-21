import React from 'react';
import ReactDOM from 'react-dom';
import {themes} from "./theme";
import './asset/App.css';
import {AppLoader} from "@control-ui/app/AppLoader";

const App = AppLoader(
    {themes},
    () => import('./App'),
    'Loading',
);

ReactDOM.render(<App/>, document.getElementById('root'));
