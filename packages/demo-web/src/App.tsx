import { lazy, Suspense } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom'

const AppMui = lazy(() => import('./AppMui'))
const Bootstrap = lazy(() => import('./bootstrap/page-main'))
const KitDnd = lazy(() => import('./kit-dnd/page-dnd'))
const KitDndGrid = lazy(() => import('./kit-dnd/page-grid'))

export const App = () => <Router>
    <Suspense>
        <Switch>
            <Route path={['/mui-*', '/']} exact component={AppMui}/>
            <Route path="/bootstrap" component={Bootstrap}/>
            <Route path="/kit-dnd" component={KitDnd}/>
            <Route path="/kit-dnd-grid" component={KitDndGrid}/>
        </Switch>
    </Suspense>
</Router>
