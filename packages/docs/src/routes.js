import React from 'react';
import Loadable from 'react-loadable';
import {LoadingCircular} from "@control-ui/core/es/LoadingCircular";
import {routesDocs, routesWidgets} from "./content/docs";

export const routes = {
    routes: [
        {
            path: '/:lng',
            nav: {
                to: '/',
                label: 'Home',
            },
            content: {
                exact: true,
                component: Loadable({
                    loader: () => import('./page/PageMain'),
                    loading: (props) => <LoadingCircular {...props} title='Loading Home'/>,
                })
            }
        }, {
            path: '/:lng/docs/:docId+',
            nav: {
                to: '/docs',
                label: 'Documentation',
            },
            content: {
                component: Loadable({
                    loader: () => import('./page/DocsDetails'),
                    loading: (props) => <LoadingCircular {...props} title='Loading Docs'/>,
                })
            },
            doc: true,
            routes: [
                ...routesDocs.routes,
                ...routesWidgets.routes,
            ]
        }, {
            path: '/:lng/examples/:schema?',
            nav: {
                to: '/docs',
                label: 'Live-Editor',
            },
            content: {
                component: Loadable({
                    loader: () => import('./page/PageLiveEdit'),
                    loading: (props) => <LoadingCircular {...props} title='Loading Live-Editor'/>,
                })
            },
        }, {
            path: '/:lng/quick-start',
            nav: {
                to: '/quick-start',
                label: 'Quick-Start',
            },
            content: {
                component: Loadable({
                    loader: () => import('./page/PageQuickStart'),
                    loading: (props) => <LoadingCircular {...props} title='Loading Quick-Start'/>,
                })
            },
        }, {
            path: '/:lng/impress',
            content: {
                component: Loadable({
                    loader: () => import('./page/PageLaw').then(m => m.PageImpress),
                    loading: (props) => <LoadingCircular {...props} title='Loading'/>,
                })
            },
        }, {
            path: '/:lng/privacy',
            content: {
                component: Loadable({
                    loader: () => import('./page/PageLaw').then(m => m.PagePrivacy),
                    loading: (props) => <LoadingCircular {...props} title='Loading'/>,
                })
            },
        },
    ]
};
