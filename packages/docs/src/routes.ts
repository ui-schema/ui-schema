import React from 'react'
import * as Loadable from 'react-loadable'
import { DocRouteModule, routesDocs } from './content/docs'

export type Comp = React.ComponentType<{ scrollContainer: React.MutableRefObject<HTMLDivElement | null> }>
export const routes = (loading: any): DocRouteModule<Comp> => ({
    routes: [
        {
            path: '/',
            nav: {
                to: '/',
                label: 'Home',
            },
            config: {
                content: {
                    exact: true,
                    /*component: Loadable({
                        loader: () => import('./page/PageMain'),
                        loading: (props) => {
                            console.log(props)
                            return <LoadingCircular {...props} title="Loading Home"/>
                        },
                    }),*/
                    component: Loadable({
                        loader: () => import('./page/PageMain'),
                        loading: loading('Loading'),
                    }) as Comp,
                },
            },
        }, {
            path: '/docs/:docId+',
            nav: {
                to: '/docs',
                label: 'Documentation',
            },
            config: {
                content: {
                    component: Loadable({
                        loader: () => import('./page/DocsDetails'),
                        loading: loading('Loading Docs'),
                    }) as Comp,
                },
            },
            // doc: true,
            // @ts-ignore
            routes: routesDocs.routes,
        }, {
            doc: 'updates/overview',
            path: '/updates',
            nav: {
                to: '/updates',
                label: 'Updates / Migration',
                initialOpen: false,
                toSection: /^(\/updates)/,
            },
            config: {
                content: {
                    component: Loadable({
                        loader: () => import('./page/DocsDetails'),
                        loading: loading('Loading Docs'),
                    }) as Comp,
                },
            },
            routes: [
                {
                    // @ts-ignore
                    doc: 'updates/v0.2.0-v0.3.0',
                    path: '/updates/v0.2.0-v0.3.0',
                    nav: {
                        to: '/updates/v0.2.0-v0.3.0',
                        initialOpen: false,
                        label: 'v0.2.0 to v0.3.0',
                    },
                }, {
                    // @ts-ignore
                    doc: 'updates/v0.3.0-v0.4.0',
                    path: '/updates/v0.3.0-v0.4.0',
                    nav: {
                        to: '/updates/v0.3.0-v0.4.0',
                        initialOpen: false,
                        label: 'v0.3.0 to v0.4.0',
                    },
                },
            ],
        }, {
            path: '/examples/:schema?',
            nav: {
                to: '/docs',
                label: 'Live-Editor',
            },
            config: {
                content: {
                    component: Loadable({
                        loader: () => import('./page/PageLiveEdit'),
                        loading: loading('Loading Live-Editor'),
                    }) as Comp,
                },
            },
        }, {
            path: '/quick-start',
            nav: {
                to: '/quick-start',
                label: 'Quick-Start',
            },
            config: {
                content: {
                    component: Loadable({
                        loader: () => import('./page/PageQuickStart'),
                        loading: loading('Loading Quick-Start'),
                    }) as Comp,
                },
            },
        }, {
            path: '/impress',
            config: {
                content: {
                    component: Loadable({
                        loader: () => import('./page/PageLaw').then(m => m.PageImpress),
                        loading: loading('Loading'),
                    }) as Comp,
                },
            },
        }, {
            path: '/privacy',
            config: {
                content: {
                    component: Loadable({
                        loader: () => import('./page/PageLaw').then(m => m.PagePrivacy),
                        loading: loading('Loading'),
                    }) as Comp,
                },
            },
        },
    ],
})
