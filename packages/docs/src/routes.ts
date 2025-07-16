import React, { lazy } from 'react'
import { DocRouteModule, routesDocs } from './content/docs'

export type Comp = React.ComponentType<{ scrollContainer: React.MutableRefObject<HTMLDivElement | null> }>

// type Loading = <P = {}>(title: string, Content: React.ComponentType<P>) => React.ComponentType<P>

const DocsDetailsLazy = lazy(() => import('./page/DocsDetails'))

export const routes = (): DocRouteModule<Comp> => ({
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
                    component: lazy(() => import('./page/PageHome')) as Comp,
                    // component: loading('Loading', lazy(() => import('./page/PageHome'))) as Comp,
                },
            },
        },
        {
            path: '/docs/:docId+',
            nav: {
                to: '/docs',
                label: 'Documentation',
            },
            config: {
                content: {
                    component: DocsDetailsLazy as Comp,
                },
            },
            // doc: true,
            // @ts-ignore
            routes: routesDocs.routes,
        },
        {
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
                    component: DocsDetailsLazy as Comp,
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
        },
        {
            path: '/guides/:docId+',
            nav: {
                to: '/guides',
                label: 'Guides',
            },
            config: {
                content: {
                    component: DocsDetailsLazy as Comp,
                },
            },
            routes: [
                {
                    // @ts-ignore
                    doc: 'guides/widgets-overriding',
                    path: '/guides/widgets-overriding',
                    nav: {
                        to: '/guides/widgets-overriding',
                        label: 'Widgets Overriding',
                    },
                },
            ],
        },
        {
            path: '/examples/:schema?',
            nav: {
                to: '/examples',
                label: 'Live-Editor',
            },
            config: {
                content: {
                    // component: loading('Loading Live-Editor', lazy(() => import('./page/PageLiveEdit'))) as Comp,
                    component: lazy(() => import('./page/PageLiveEdit')) as Comp,
                },
            },
        },
        {
            path: '/quick-start',
            nav: {
                to: '/quick-start',
                label: 'Quick-Start',
            },
            config: {
                content: {
                    // component: loading('Loading Quick-Start', lazy(() => import('./page/PageQuickStart'))) as Comp,
                    component: lazy(() => import('./page/PageQuickStart')) as Comp,
                },
            },
        },
        {
            path: '/impress',
            config: {
                content: {
                    // component: loading('Loading', lazy(() => import('./page/PageLaw').then(m => ({default: m.PageImpress})))) as Comp,
                    component: lazy(() => import('./page/PageLaw').then(m => ({default: m.PageImpress}))) as Comp,
                },
            },
        },
        {
            path: '/privacy',
            config: {
                content: {
                    // component: loading('Loading', lazy(() => import('./page/PageLaw').then(m => ({default: m.PagePrivacy})))) as Comp,
                    component: lazy(() => import('./page/PageLaw').then(m => ({default: m.PagePrivacy}))) as Comp,
                },
            },
        },
    ],
})

export const routing = routes()
