import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

const root = createRoot(document.querySelector('#root') as Element)
root.render(
    <React.Profiler id="Pickers Demo App" onRender={() => null}>
        <App/>
    </React.Profiler>,
)
