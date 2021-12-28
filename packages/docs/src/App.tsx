import React from 'react'
import Loadable from 'react-loadable'
import { App } from '@control-ui/app/App'
import { I18nProviderContext } from '@control-ui/app/I18nProvider'
import { routes } from './routes'
import { DndProvider } from 'react-dnd'
import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { Layout } from '@control-ui/app/Layout'
import { CustomDrawer, CustomHeader } from './component/Layout'
import { LoadingCircular } from '@control-ui/kit/Loading/LoadingCircular'
import { DocsProvider } from '@control-ui/docs/DocsProvider'
import { HeadlinesProvider } from '@control-ui/docs/LinkableHeadline'
import { customWidgets } from './component/Schema/widgets'
import { browserT } from './t'
import { UIMetaProvider } from '@ui-schema/ui-schema/UIMeta'
import { UIApiProvider } from '@ui-schema/ui-schema/UIApi'
import { loadSchemaUIApi } from '@ui-schema/ui-schema'

const loadSchema: loadSchemaUIApi = (url, versions) => {
    console.log('loadSchema (url, optional versions)', url, versions)
    return fetch(url).then(r => r.json())
}

const Provider: React.ComponentType<React.PropsWithChildren<{}>> = ({children}) => (
    <DocsProvider loader={(file: string) => import('./content/docs/' + file + '.md')}>
        <HeadlinesProvider>
            <UIApiProvider loadSchema={loadSchema} noCache>
                <UIMetaProvider widgets={customWidgets} t={browserT}>
                    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                        {children}
                    </DndProvider>
                </UIMetaProvider>
            </UIApiProvider>
        </HeadlinesProvider>
    </DocsProvider>
)

const PageNotFound = Loadable({
    loader: () => import('./page/PageNotFound'),
    // eslint-disable-next-line react/display-name
    loading: () => <LoadingCircular title={'Not Found'}/>,
})

let CustomLayout: React.ComponentType<{}> = () => <Layout
    Header={CustomHeader}
    Drawer={CustomDrawer}
    NotFound={PageNotFound}
    mainContentStyle={{position: 'relative'}}
/>
CustomLayout = React.memo(CustomLayout)

const i18n: I18nProviderContext = {
    allLanguages: {
        en: '0.1',
    },
    detection: ['localStorage'],
    defaultLanguage: 'en',
    //pathIndex: 0,
    loader: (url: string) => import ('./locales/' + url + '.json'),
    //l10n: {ns: {de: {}}},
    expiration: 0,
}

const CustomApp: React.ComponentType<{}> = () => <App
    // @ts-ignore
    routes={routes}
    Layout={CustomLayout}
    i18n={i18n}
    Provider={Provider}
/>

export default CustomApp
