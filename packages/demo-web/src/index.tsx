import { Profiler } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

const root = createRoot(document.querySelector('#root') as Element)
root.render(
    <Profiler id="Demo App" onRender={() => null}>
        <App/>
    </Profiler>,
)
