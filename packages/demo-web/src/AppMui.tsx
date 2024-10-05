import { CircularProgress } from '@mui/material'
import { lazy, Suspense } from 'react'
import {
    Switch,
    Route,
} from 'react-router-dom'
import AppTheme from './material-ui/layout/AppTheme'
import Dashboard from './material-ui/layout/Dashboard'

const MaterialUi = lazy(() => import('./material-ui/material-ui'))
const MaterialUiPro = lazy(() => import('./material-ui/material-ui-pro'))
const MaterialUiDnd = lazy(() => import('./material-ui/material-ui-dnd'))
const MaterialUiDndGrid = lazy(() => import('./material-ui/material-ui-dnd-grid'))
const MaterialUiEditorJS = lazy(() => import('./material-ui/material-ui-editorjs'))
const MaterialUiSlate = lazy(() => import('./material-ui/material-ui-slate'))
const MaterialUiDebounced = lazy(() => import('./material-ui/material-ui-debounced'))
const MaterialUiSplit = lazy(() => import('./material-ui/material-ui-split'))
const MaterialUiReadWrite = lazy(() => import('./material-ui/material-ui-read-write'))

const AppMui = () => {
    return <AppTheme>
        <Dashboard>
            <Suspense fallback={<CircularProgress sx={{m: 'auto'}}/>}>
                <Switch>
                    <Route path="/mui-slate" component={MaterialUiSlate}/>
                    <Route path="/mui-pro" component={MaterialUiPro}/>
                    <Route path="/mui-editorjs" component={MaterialUiEditorJS}/>
                    <Route path="/mui-dnd" component={MaterialUiDnd}/>
                    <Route path="/mui-read-write" component={MaterialUiReadWrite}/>
                    <Route path="/mui-dnd-grid" component={MaterialUiDndGrid}/>
                    <Route path="/mui-debounced" component={MaterialUiDebounced}/>
                    <Route path="/mui-split" component={MaterialUiSplit}/>
                    <Route path="/" exact component={MaterialUi}/>
                </Switch>
            </Suspense>
        </Dashboard>
    </AppTheme>
}

export default AppMui
