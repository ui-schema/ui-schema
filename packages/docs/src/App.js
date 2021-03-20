import React from 'react';
import Loadable from 'react-loadable';
import {App} from '@control-ui/app/App';
import {routes} from './routes';
import {Layout} from '@control-ui/app/Layout';
import {CustomDrawer, CustomHeader} from './component/Layout';
import {LoadingCircular} from '@control-ui/kit/Loading/LoadingCircular';
import {DocsProvider} from '@control-ui/docs/DocsProvider';
import {HeadlinesProvider} from '@control-ui/docs/LinkableHeadline';

const Provider = ({children}) => (
    <DocsProvider loader={(file) => import('./content/docs/' + file + '.md')}>
        <HeadlinesProvider>
            {children}
        </HeadlinesProvider>
    </DocsProvider>
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
    detection: ['localStorage'],
    defaultLanguage: 'en',
    //pathIndex: 0,
    loader: (url) => import ('./locales/' + url + '.json'),
    l10n: {ns: {de: {}}},
};

const CustomApp = () => <App
    routes={routes}
    Layout={CustomLayout}
    i18n={i18n}
    Provider={Provider}
/>;

export default CustomApp;
