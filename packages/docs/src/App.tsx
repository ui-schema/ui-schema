import React from 'react'
import { App } from '@control-ui/app/App'
import { BrowserRouter } from 'react-router-dom'
import { I18nProviderContext } from '@control-ui/app/I18nProvider'
import { routes } from './routes'
import { DndProvider } from 'react-dnd'
import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { DocsProvider } from '@control-ui/docs/DocsProvider'
import { HeadlinesProvider } from '@control-ui/docs/LinkableHeadline'
import { customWidgets } from './component/Schema/widgets'
import { browserT } from './t'
import { customConsentUi } from './consentUi'
import { ConsentUiProvider } from '@bemit/consent-ui-react'
import { pluginGoogle, prepareConsent } from '@bemit/consent-ui'
import { DocsIndexProvider } from '@control-ui/docs/DocsIndexProvider'
import { DocsSearchProvider } from '@control-ui/docs/DocsSearchProvider'
import { CustomLayout } from './component/Layout'
import { LoadingCircular } from '@control-ui/kit/Loading/LoadingCircular'
import { loadSchemaUIApi, UIApiProvider } from '@ui-schema/react/UIApi'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'

const loadSchema: loadSchemaUIApi = (url, versions) => {
    console.log('loadSchema (url, optional versions)', url, versions)
    return fetch(url).then(r => r.json())
}

if (process.env.REACT_APP_G_TAG) {
    prepareConsent({
        localKey: '_consent',
        version: 'a',
        trackers: [
            pluginGoogle('measure', process.env.REACT_APP_G_TAG as string),
        ],
    })
} else {
    prepareConsent({
        localKey: '_consent',
        version: 'a',
        trackers: [],
    })
}

const indexRefs = {
    modules: 'docs/index.json',
    pages: 'docs/index-pages.json',
}

const docsLoader = (file: string): Promise<string> => import('./content/' + file + '.md')

const Provider: React.ComponentType<React.PropsWithChildren<{}>> = ({children}) => (
    <ConsentUiProvider locale={'en'} definition={customConsentUi} ownId={'bemit'}>
        <DocsProvider loader={docsLoader}>
            <DocsIndexProvider indexRefs={indexRefs}>
                <DocsSearchProvider localKey={'uis-search-history'} bindKey={'k'}>
                    <HeadlinesProvider>
                        <UIApiProvider loadSchema={loadSchema} noCache>
                            <UIMetaProvider widgets={customWidgets} t={browserT}>
                                <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                                    {children}
                                </DndProvider>
                            </UIMetaProvider>
                        </UIApiProvider>
                    </HeadlinesProvider>
                </DocsSearchProvider>
            </DocsIndexProvider>
        </DocsProvider>
    </ConsentUiProvider>
)

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

// eslint-disable-next-line react/display-name
export const loading = (title) => (props) => <LoadingCircular {...props} title={title}/>
const readyRoutes = routes(loading)
const CustomApp: React.ComponentType<{}> = () =>
    <BrowserRouter basename={'/'}>
        <App
            // @ts-ignore
            routes={readyRoutes}
            Layout={CustomLayout}
            i18n={i18n}
            Provider={Provider}
        />
    </BrowserRouter>

export default CustomApp
