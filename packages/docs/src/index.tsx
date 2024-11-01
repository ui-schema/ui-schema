import React from 'react'
import { createRoot } from 'react-dom/client'
import { themes } from './theme'
import './asset/App.css'
import { AppLoader } from '@control-ui/app/AppLoader'

const onError = (error: any): void => console.log(error)
const App = AppLoader(
    {themes},
    () => import('./App'),
    'Loading',
    'Error loading App component',
    onError,
)

createRoot(document.getElementById('root')!)
    .render(<App/>)
