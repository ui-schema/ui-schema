import React from 'react'
import { App } from '@control-ui/app/App'
import { I18nProviderContext } from '@control-ui/app/I18nProvider'
import { routes } from './routes'
import { DndProvider } from 'react-dnd'
import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { DocsProvider } from '@control-ui/docs/DocsProvider'
import { HeadlinesProvider } from '@control-ui/docs/LinkableHeadline'
import { customWidgets } from './component/Schema/widgets'
import { browserT } from './t'
import { UIMetaProvider } from '@ui-schema/ui-schema/UIMeta'
import { UIApiProvider } from '@ui-schema/ui-schema/UIApi'
import { loadSchemaUIApi } from '@ui-schema/ui-schema'
import { customConsentUi } from './consentUi'
import { ConsentUiProvider } from '@bemit/consent-ui-react'
import { pluginGoogle, prepareConsent } from '@bemit/consent-ui'
import { CustomLayout } from './component/Layout'

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

const Provider: React.ComponentType<React.PropsWithChildren<{}>> = ({children}) => (
    <ConsentUiProvider locale={'en'} definition={customConsentUi} ownId={'bemit'}>
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

const CustomApp: React.ComponentType<{}> = () => <App
    // @ts-ignore
    routes={routes}
    Layout={CustomLayout}
    i18n={i18n}
    Provider={Provider}
/>

export default CustomApp
