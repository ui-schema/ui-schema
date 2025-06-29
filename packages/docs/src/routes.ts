import React, { lazy } from 'react'
import { DocRouteModule, routesDocs } from './content/docs'

export type Comp = React.ComponentType<{ scrollContainer: React.MutableRefObject<HTMLDivElement | null> }>
type Loading = <P = {}>(title: string, Content: React.ComponentType<P>) => React.ComponentType<P>
export const routes = (loading: Loading): DocRouteModule<Comp> => ({
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
                    component: loading('Loading', lazy(() => import('./page/PageHome'))) as Comp,
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
                    component: loading('Loading Docs Viewer', lazy(() => import('./page/DocsDetails'))) as Comp,
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
                    component: loading('Loading Docs Viewer', lazy(() => import('./page/DocsDetails'))) as Comp,
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
                },
                {
                    // @ts-ignore
                    doc: 'updates/v0.3.0-v0.4.0',
                    path: '/updates/v0.3.0-v0.4.0',
                    nav: {
                        to: '/updates/v0.3.0-v0.4.0',
                        initialOpen: false,
                        label: 'v0.3.0 to v0.4.0',
                    },
                },
                {
                    // @ts-ignore
                    doc: 'updates/v0.4.0-v0.5.0',
                    path: '/updates/v0.4.0-v0.5.0',
                    nav: {
                        to: '/updates/v0.4.0-v0.5.0',
                        initialOpen: false,
                        label: 'v0.4.0 to v0.5.0',
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
                    component: loading('Loading Live-Editor', lazy(() => import('./page/PageLiveEdit'))) as Comp,
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
                    component: loading('Loading Quick-Start', lazy(() => import('./page/PageQuickStart'))) as Comp,
                },
            },
        }, {
            path: '/impress',
            config: {
                content: {
                    component: loading('Loading', lazy(() => import('./page/PageLaw').then(m => ({default: m.PageImpress})))) as Comp,
                },
            },
        }, {
            path: '/privacy',
            config: {
                content: {
                    component: loading('Loading', lazy(() => import('./page/PageLaw').then(m => ({default: m.PagePrivacy})))) as Comp,
                },
            },
        },
    ],
})
