import { CircularProgress } from '@mui/material'
import { lazy, Suspense } from 'react'
import {
    Switch,
    Route,
} from 'react-router-dom'
import AppTheme from './material-ui/layout/AppTheme'
import Dashboard from './material-ui/layout/Dashboard'

const MaterialUi = lazy(() => import('./material-ui/material-ui.js'))
const MaterialUiExamples = lazy(() => import('./material-ui/material-ui-examples.js'))
const MaterialUiPro = lazy(() => import('./material-ui/material-ui-pro.js'))
const MaterialUiDnd = lazy(() => import('./material-ui/material-ui-dnd.js'))
const MaterialUiDndGrid = lazy(() => import('./material-ui/material-ui-dnd-grid.js'))
const MaterialUiDebounced = lazy(() => import('./material-ui/material-ui-debounced.js'))
const MaterialUiSplit = lazy(() => import('./material-ui/material-ui-split.js'))
const MaterialUiReadWrite = lazy(() => import('./material-ui/material-ui-read-write.js'))

const AppMui = () => {
    return <AppTheme>
        <Dashboard>
            <Suspense fallback={<CircularProgress sx={{m: 'auto'}}/>}>
                <Switch>
                    <Route path="/mui-pro" component={MaterialUiPro}/>
                    <Route path="/mui-dnd" component={MaterialUiDnd}/>
                    <Route path="/mui-read-write" component={MaterialUiReadWrite}/>
                    <Route path="/mui-dnd-grid" component={MaterialUiDndGrid}/>
                    <Route path="/mui-debounced" component={MaterialUiDebounced}/>
                    <Route path="/mui-split" component={MaterialUiSplit}/>
                    <Route path="/mui-examples" exact component={MaterialUiExamples}/>
                    <Route path="/" exact component={MaterialUi}/>
                </Switch>
            </Suspense>
        </Dashboard>
    </AppTheme>
}

export default AppMui
