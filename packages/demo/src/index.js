import React from 'react'
import {render} from 'react-dom'
import {App} from './App';
import {unstable_trace as trace} from 'scheduler/tracing';

trace('initial render', performance.now(), () =>
    render(
        <React.Profiler id="Demo App" onRender={() => null}>
            <App/>
        </React.Profiler>,
        document.querySelector('#root'),
    ),
)
