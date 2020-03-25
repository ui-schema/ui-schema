import React from 'react';
import Loadable from 'react-loadable';
import {Switch, Route} from 'react-router-dom';
import App from "@control-ui/layouts/es/App";
import {routes} from "./routes";
import {Layout} from "@control-ui/layouts/es/default/Layout";
import {CustomDrawer, CustomHeader} from "./component/Layout";
import {LoadingCircular} from "@control-ui/core/es/LoadingCircular";
import {DocsProvider} from "@control-ui/docs/es/DocsProvider";
import {HeadlinesProvider} from "@control-ui/docs/es/LinkableHeadline";
import {I18nRedir} from "./component/I18nRedir";

const Provider = ({children}) => (
    <>
        <Switch>
            <Route exact path={'/'} component={I18nRedir}/>
            <Route path={'/examples'} exact render={() => <I18nRedir to={'examples'}/>}/>
            <Route path={'/quick-start'} exact render={() => <I18nRedir to={'quick-start'}/>}/>
            <Route path={'/docs'} exact render={() => <I18nRedir to={'docs'}/>}/>
        </Switch>
        <DocsProvider loader={(file) => import('./content/docs/' + file + '.md')}>
            <HeadlinesProvider>
                {children}
            </HeadlinesProvider>
        </DocsProvider>
    </>
);

const PageNotFound = Loadable({
    loader: () => import('./page/PageNotFound'),
    loading: () => <LoadingCircular title={'Not Found'}/>,
});

const CustomLayout = () => <Layout
    Header={CustomHeader}
    Drawer={CustomDrawer}
    NotFound={PageNotFound}
/>;

const i18n = {
    allLanguages: {
        en: '0.1',
    },
    detection: ['path', 'localStorage'],
    defaultLanguage: 'en',
    pathIndex: 0,
    loader: (url) => import ('./locales/' + url + '.json'),
    l10n: {ns: {de: {}}}
};

const CustomApp = () => <App
    routes={routes}
    Layout={CustomLayout}
    i18n={i18n}
    Provider={Provider}
/>;

export default CustomApp;
