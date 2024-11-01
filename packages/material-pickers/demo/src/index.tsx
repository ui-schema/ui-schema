import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

createRoot(document.querySelector('#root')!)
    .render(
        <React.Profiler id="Pickers Demo App" onRender={() => null}>
            <App/>
        </React.Profiler>,
    )
