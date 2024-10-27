/**
 * @jest-environment jsdom
 */
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import React, { PropsWithChildren } from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/jest-globals'
import { List } from 'immutable'
import { MockWidgets } from './MockSchemaProvider.mock'
import { createStore, extractValue, UIStoreProvider, WithValue } from '@ui-schema/react/UIStore'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { createOrderedMap } from '@ui-schema/system/createMap'
import {
    CombiningHandler, ConditionalHandler, DefaultHandler, DependentHandler, ReferencingHandler,
} from '@ui-schema/react-json-schema'
import { isInvalid, ValidityReporter } from '@ui-schema/react/ValidityReporter'
import { SchemaPluginsAdapter } from '@ui-schema/react/SchemaPluginsAdapter'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { getValidators } from '@ui-schema/json-schema/getValidators'
import { translateRelative } from '@ui-schema/system/TranslatorRelative'
import { JsonSchema } from '@ui-schema/json-schema/Definitions'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { injectWidgetEngine } from '@ui-schema/react/applyWidgetEngine'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { NextPluginRenderer, WidgetEngine } from '@ui-schema/react/WidgetEngine'

/**
 * This file serves as general integration test
 *
 * - checking rendering from root to widget renderer
 * - checking validation stack / plugin stack basic execution
 * - checking basic error pass through
 *
 * todo: test on details and behaviour instead of only does-render-stuff
 *
 * npm test -- --testPathPattern=UIRenderer.test.tsx -u
 */

const widgets = {
    ...MockWidgets,
    types: {...MockWidgets.types},
    custom: {...MockWidgets.custom},
}
// todo: add custom ErrorFallback, otherwise some errors may be catched there - and the test will not fail

// eslint-disable-next-line react/display-name
widgets.GroupRenderer = ({children}): React.ReactElement => <div className={'group-renderer'}>{children}</div>
widgets.widgetPlugins = [
    // plugin to have every widget in it's own div - to query against in tests
    (props) => <div><NextPluginRenderer {...props}/></div>,
    ReferencingHandler,
    // ExtractStorePlugin,
    CombiningHandler,
    DefaultHandler,
    DependentHandler,
    ConditionalHandler,
    SchemaPluginsAdapter,
    ValidityReporter,
    WidgetRenderer,
]
widgets.schemaPlugins = getValidators()

// eslint-disable-next-line react/display-name
widgets.types.string = (props: WidgetProps): React.ReactElement => {
    return <>
        <span>string-renderer</span>
        <span><TranslateTitle schema={props.schema} storeKeys={props.storeKeys}/></span>
        {props.valid ? null : <span>string-with-error</span>}
        {props.errors?.hasError() ? <span>{JSON.stringify(props.errors.errorsToJS())}</span> : null}
    </>
}

// eslint-disable-next-line react/display-name
widgets.types.array = extractValue((props: WidgetProps & WithValue): React.ReactElement => {
    return <>
        <span>array-renderer</span>
        <span><TranslateTitle schema={props.schema} storeKeys={props.storeKeys}/></span>
        {/* @ts-ignore */}
        {List.isList(props.value) ? props.value.map((val, i: number) =>
            <div key={i}>
                <div style={{display: 'flex', flexDirection: 'column', flexGrow: 2}}>
                    {null}
                    {/* @ts-ignore */}
                    <WidgetEngine
                        showValidity={props.showValidity}
                        // @ts-ignore
                        schema={props.schema.get('items')} //parentSchema={schema}
                        storeKeys={props.storeKeys.push(i)} //level={level + 1}
                        noGrid
                    />
                </div>
            </div>).valueSeq() : null}
        {props.valid ? null : <span>array-with-error</span>}
    </>
})

// note: for DS which implement a grid system, this is the `GridContainer`/`GridStack` components
const RootContainer = ({children}: PropsWithChildren<any>): React.ReactElement => <div className={'root-container'}>{children}</div>
const RootStack = injectWidgetEngine(RootContainer)

const TestUIRenderer = (props: {
    data?: {
        demo_string?: string
        demo_number?: number
        demo_array?: []
        demo_array2?: string[]
    }
    notT?: boolean
    noStore?: boolean
}) => {

    // needed variables and setters for the UIGenerator, create wherever you like
    const [store, setStore] = React.useState(() => createStore(createOrderedMap(props.data || {demo_string: ''})))

    const [schema/*, setSchema*/] = React.useState(() => createOrderedMap({
        type: 'object',
        $defs: {
            demo_number_def: {
                $anchor: 'demo_number',
                type: 'number',
                multipleOf: 5,
                maximum: 50,
            },
            type_string: {
                $id: '#type_string',
            },
            person: {
                type: 'object',
                properties: {
                    // todo: workaround if IDE doesn't correctly match the typing to a deeply nested property
                    name: {
                        type: 'string',
                    } as JsonSchema,
                    children: {
                        type: 'array',
                        items: {$ref: '#/definitions/person'},
                        'default': [],
                    },
                },
                if: {
                    properties: {
                        name: {
                            type: 'string',
                            const: 'Musterman',
                        },
                    },
                },
                then: {
                    properties: {
                        name: {
                            minLength: 30,
                        },
                    },
                },
            },
        },
        properties: {
            demo_string: {
                type: 'string',
                minLength: 0,
                maxLength: 6,
            },
            demo_number: {
                $ref: '#demo_number',
            },
            demo_array: {
                type: 'array',
                default: ['def-value'],
                items: {
                    type: 'string',
                },
            },
            demo_array2: {
                type: 'array',
                items: {
                    type: 'string',
                },
            },
            person: {$ref: '#/definitions/person'},
        },
        allOf: [{
            if: {
                properties: {
                    demo_string: {
                        type: 'string',
                        const: 'test',
                    },
                },
                // without `required` this now (>=0.4.3) would resolve always after fixing ConditionalHandler
                required: ['demo_string'],
            },
            then: {
                properties: {
                    demo_string: {
                        widget: 'Text',
                    },
                },
            },
        }],
        dependentSchemas: {
            demo_number: {
                properties: {
                    demo_string: {
                        type: 'string',
                        minLength: 2,
                    },
                },
            },
        },
        dependentRequired: {
            demo_array2: ['demo_number'],
        },
        required: ['demo_number'],
    } as unknown as JsonSchema))

    const onChange = React.useCallback((actions) => {
        setStore(storeUpdater(actions))
    }, [setStore])

    return <UIMetaProvider
        widgets={widgets}
        t={props.notT ? translateRelative : (text: string) => text}
    >
        <UIStoreProvider
            store={props.noStore ? undefined : store}
            onChange={onChange}
            showValidity
        >
            <RootStack isRoot schema={schema}/>
        </UIStoreProvider>
        <div>store-is-{isInvalid(store.getValidity()) ? 'invalid' : 'correct'}</div>
    </UIMetaProvider>
}

describe('UIGenerator Integration', () => {
    it('TestUIRenderer', async () => {
        const {queryByText, queryAllByText, container} = render(
            <TestUIRenderer data={{demo_number: 10, demo_array2: ['val-test']}}/>,
        )
        expect(container.querySelectorAll('.root-container').length).toBe(1)
        expect(container.querySelectorAll('.group-renderer').length).toBe(2)
        expect(queryByText('store-is-correct') !== null).toBeTruthy()
        expect(queryByText('store-is-invalid')).toBe(null)
        expect(queryByText('widget.demo_string.title') !== null).toBeTruthy()
        expect(queryAllByText('string-renderer').length).toBe(4)
        expect(queryByText('string-with-error') === null).toBeTruthy()
        expect(queryByText('missing-type-number') !== null).toBeTruthy()
        expect(queryAllByText('array-renderer').length).toBe(3)
    })
    it('TestUIRenderer no `store`', async () => {
        const {queryByText, queryAllByText, container} = render(
            <TestUIRenderer noStore/>,
        )
        // expect(container).toMatchSnapshot()
        expect(container.querySelectorAll('.root-container').length).toBe(1)
        expect(container.querySelectorAll('.group-renderer').length).toBe(2)

        expect(queryByText('Demo String')).toBe(null)
        expect(queryByText('widget.demo_string.title') !== null).toBeTruthy()
        expect(queryAllByText('string-renderer').length).toBe(2)
        expect(queryByText('store-is-invalid') !== null).toBeTruthy()
    })
    it('TestUIRenderer not `t`', async () => {
        const {queryByText, queryAllByText, container} = render(
            <TestUIRenderer notT/>,
        )
        expect(container.querySelectorAll('.root-container').length).toBe(1)
        expect(container.querySelectorAll('.group-renderer').length).toBe(2)
        expect(queryByText('Demo String') !== null).toBeTruthy()
        expect(queryByText('widget.demo_string.title')).toBe(null)
        expect(queryAllByText('string-renderer').length).toBe(3)
    })
    it('TestUIRenderer ConditionalCombining', async () => {
        const {queryByText, container} = render(
            <TestUIRenderer data={{demo_string: 'test'}}/>,
        )
        // expect(container).toMatchSnapshot()
        expect(container.querySelectorAll('.root-container').length === 1).toBeTruthy()
        expect(container.querySelectorAll('.group-renderer').length > 0).toBeTruthy()
        expect(queryByText('widget.demo_string.title') == null).toBeTruthy()
        expect(queryByText('missing-custom-Text') !== null).toBeTruthy()
    })
    it('TestUIRendererError', async () => {
        const {queryByText, queryAllByText, container} = render(
            <TestUIRenderer data={{
                demo_string: 'to-long-text', demo_number: 83,
                // @ts-ignore
                demo_array: 'not-an-array',
            }}/>,
        )
        //expect(container).toMatchSnapshot()
        expect(container.querySelectorAll('.root-container').length === 1).toBeTruthy()
        expect(container.querySelectorAll('.group-renderer').length > 0).toBeTruthy()
        //expect(queryByText('store-is-correct') === null).toBeTruthy()
        //expect(queryByText('store-is-invalid') !== null).toBeTruthy()
        expect(queryByText('widget.demo_string.title') !== null).toBeTruthy()
        expect(queryByText('string-with-error') !== null).toBeTruthy()
        expect(queryAllByText('string-renderer').length === 2).toBeTruthy()
        expect(queryByText('array-with-error') !== null).toBeTruthy()
    })
})

