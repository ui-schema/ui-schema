import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import {PageNotFound} from "./component/Page/PageNotFound";
import {I18nProvider} from "./lib/I18n";
import AppTheme from "./lib/AppTheme";
import {I18nRedir} from "./lib/I18nRedir";
import {PageLoader} from "./component/Layout/Layout";
import {DrawerProvider} from "./component/Layout/Drawer";
import {HeadlinesProvider} from "./component/LinkableHeadline";

const pages = {
    Home: PageLoader(() => import('./component/Page/PageMain'), 'Loading Page'),
    LiveEdit: PageLoader(() => import('./component/Page/PageLiveEdit'), 'Loading Live-Editor'),
    DocsOverview: PageLoader(() => import('./component/Docs/DocsOverview'), 'Loading Docs'),
    Impress: PageLoader(() => import('./component/Page/PageLaw').then(r => r.PageImpress), 'Loading Page'),
    Privacy: PageLoader(() => import('./component/Page/PageLaw').then(r => r.PagePrivacy), 'Loading Page'),
    QuickStart: PageLoader(() => import('./component/Page/PageQuickStart'), 'Loading Quick Start'),
};

const PageRoutes = ({match}) => <Switch>
    <Route path={"/" + match.params.lng + "/examples/:schema?"} component={pages.LiveEdit}/>
    <Route path={"/" + match.params.lng + "/docs/(.*)?"} component={pages.DocsOverview}/>
    <Route path={"/" + match.params.lng + "/quick-start"} component={pages.QuickStart}/>
    <Route path={"/" + match.params.lng + "/impress"} component={pages.Impress}/>
    <Route path={"/" + match.params.lng + "/privacy"} component={pages.Privacy}/>
    <Route path={"/" + match.params.lng} exact component={pages.Home}/>
    <Route path={"/" + match.params.lng} component={PageNotFound}/>
</Switch>;

function App() {
    return <Router basename={'/'}>
        <I18nProvider
            allLanguages={['en', 'de', 'it', 'es', 'fr', 'pl']}
            defaultLanguage={'en'}
            pathIndex={0}
            // eslint-disable-next-line
            expiration={process.env.NODE_ENV === 'production' ? 2 * 24 * 60 * 60 * 1000 : 100}
            debug={false}
            l10n={{ns: {de: {}}}}
        >
            <React.Suspense fallback={null}>
                <Switch>
                    <Route exact path={'/'} component={I18nRedir}/>
                    <Route path={'/examples'} exact render={() => <I18nRedir to={'examples'}/>}/>
                    <Route path={'/quick-start'} exact render={() => <I18nRedir to={'quick-start'}/>}/>
                    <Route path={'/docs'} exact render={() => <I18nRedir to={'docs'}/>}/>
                </Switch>
            </React.Suspense>

            <DrawerProvider>
                <HeadlinesProvider>
                    <AppTheme>
                        <React.Suspense fallback={null}>
                            <Route path="/:lng" component={PageRoutes}/>
                        </React.Suspense>
                    </AppTheme>
                </HeadlinesProvider>
            </DrawerProvider>
        </I18nProvider>
    </Router>
}

export default App;
