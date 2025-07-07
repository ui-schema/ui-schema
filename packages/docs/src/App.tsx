import React, { Suspense } from 'react'
import { App } from '@control-ui/app/App'
import { BrowserRouter } from 'react-router-dom'
import { I18nProviderContext } from '@control-ui/app/I18nProvider'
import { routes } from './routes'
import { DndProvider } from 'react-dnd'
import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { DocsProvider } from '@control-ui/docs/DocsProvider'
import { HeadlinesProvider } from '@control-ui/docs/LinkableHeadline'
import { uiMeta } from './component/Schema/widgets'
import { customConsentUi } from './consentUi'
import { ConsentUiProvider } from '@bemit/consent-ui-react'
import { pluginGoogle, prepareConsent } from '@bemit/consent-ui'
import { DocsIndexProvider } from '@control-ui/docs/DocsIndexProvider'
import { DocsSearchProvider } from '@control-ui/docs/DocsSearchProvider'
import { CustomLayout } from './component/Layout'
import { LoadingCircular } from '@control-ui/kit/Loading'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'

if (process.env.REACT_APP_G_TAG) {
    prepareConsent({
        localKey: '_consent',
        version: 'b',
        trackers: [
            pluginGoogle('measure', process.env.REACT_APP_G_TAG as string),
        ],
    })
} else {
    prepareConsent({
        localKey: '_consent',
        version: 'b',
        trackers: [],
    })
}

const indexRefs = {
    modules: 'docs/index-modules.json',
    pages: 'docs/index-pages.json',
}

const docsLoader = (file: string): Promise<string> => import('./content/' + file + '.md')

const Provider: React.ComponentType<React.PropsWithChildren<{}>> = ({children}) => (
    <ConsentUiProvider locale={'en'} definition={customConsentUi} ownId={'bemit'}>
        <DocsProvider loader={docsLoader}>
            <DocsIndexProvider indexRefs={indexRefs}>
                <DocsSearchProvider localKey={'uis-search-history'} bindKey={'k'}>
                    <HeadlinesProvider>
                        <UIMetaProvider {...uiMeta}>
                            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                                {children}
                            </DndProvider>
                        </UIMetaProvider>
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
    //pathIndex: 0,
    loader: (url: string) => import ('./locales/' + url + '.json'),
    //l10n: {ns: {de: {}}},
    expiration: 0,
}

// export const loading = (title) => (props) => <LoadingCircular {...props} title={title}/>

const loading = (title: string, LoadableContent) => {
    return function LoadingWrapper(props) {
        return <Suspense
            fallback={<LoadingCircular title={title}/>}
        >
            <LoadableContent {...props}/>
        </Suspense>
    }
}
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
