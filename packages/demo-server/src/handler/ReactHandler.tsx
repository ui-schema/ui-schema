import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { Validator } from '@ui-schema/json-schema/Validator'
import { ObjectRendererBase as ObjectRenderer } from '@ui-schema/react-json-schema/ObjectRenderer'
import { VirtualWidgetRenderer } from '@ui-schema/react-json-schema/VirtualWidgetRenderer'
import { NoWidget } from '@ui-schema/react/NoWidget'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { createStore, UIStoreProvider } from '@ui-schema/react/UIStore'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { translateRelative } from '@ui-schema/ui-schema/TranslatorRelative'
import { Router } from 'express'
import { renderToStaticMarkup } from 'react-dom/server'

export const reactHandler = () => {
    const router = Router()
    router.get('/preview', async (_req, res) => {

        const store = createStore(createOrderedMap({
            name: 'Jane',
            comment: 'Lorem ipsum, dolor sit amet.',
        }))

        const schema = createOrderedMap({
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    title: 'Fullname',
                },
                comment: {
                    type: 'string',
                },
            },
        })

        // todo: improve with complete example
        const customBinding: any = {
            WidgetRenderer: WidgetRenderer,
            // ErrorFallback: ErrorFallback,
            GroupRenderer: ({children}) => {
                return <div style={{margin: 8}}>
                    {children}
                </div>
            },
            VirtualRenderer: VirtualWidgetRenderer,
            NoWidget: NoWidget,
            widgets: {
                object: ObjectRenderer,
                // a simple read-only string widget, as this demo only renders static HTML, no interactivity would be possible without further setup
                string: ({value, required, storeKeys, schema}) => {
                    const inputValue = typeof value === 'string' || typeof value === 'number' ? value : ''
                    return <div>
                        <p>
                            <span><TranslateTitle schema={schema} storeKeys={storeKeys}/>{required ? <sup>{'*'}</sup> : ''}{': '}</span>
                            <span>{inputValue || <em>{'empty'}</em>}</span>
                        </p>
                    </div>
                },
            },
        }

        const validate = Validator(standardValidators).validate

        const html = renderToStaticMarkup(
            <div>
                <UIMetaProvider
                    binding={customBinding}
                    validate={validate}
                    t={translateRelative}
                >
                    <UIStoreProvider
                        store={store}
                        onChange={() => undefined}
                        showValidity={false}
                    >
                        <div>
                            <WidgetEngine isRoot schema={schema}/>
                        </div>
                    </UIStoreProvider>
                </UIMetaProvider>
            </div>,
        )
        return res.send(html)
    })
    return router
}
