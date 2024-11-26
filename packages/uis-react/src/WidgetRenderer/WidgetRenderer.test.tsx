/**
 * @jest-environment jsdom
 */
import { ReactNode } from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/jest-globals'
import { WidgetRenderer, WidgetRendererProps } from './WidgetRenderer.js'
import { createOrderedMap } from '@ui-schema/system/createMap'
import { VirtualArrayRenderer, VirtualWidgetRendererProps, VirtualWidgetsMapping } from '@ui-schema/react/VirtualWidgetRenderer'
import { NoWidgetProps, WidgetProps, WidgetsBindingFactory } from '@ui-schema/react/Widgets'
import { ObjectRenderer } from '@ui-schema/react-json-schema/ObjectRenderer'
import { List } from 'immutable'
import { ExtractStorePlugin } from '@ui-schema/react/ExtractStorePlugin'
import { createStore, UIStoreProvider, WithScalarValue } from '@ui-schema/react/UIStore'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { translateRelative } from '@ui-schema/system/TranslatorRelative'

export const virtualWidgets: VirtualWidgetsMapping & { default_with_id: VirtualWidgetsMapping['default'] } = {
    // eslint-disable-next-line react/display-name
    'default': () => <span>virtual-default-renderer</span>,
    // eslint-disable-next-line react/display-name
    'default_with_id': ({value}) => <span id={'virtual-default-renderer__' + value}/>,
    // eslint-disable-next-line react/display-name
    'object': ObjectRenderer,
    // eslint-disable-next-line react/display-name
    'array': () => <span>virtual-array-renderer</span>,
}

const NoWidget = ({scope, matching}: NoWidgetProps): ReactNode => <>missing-{scope}{matching ? '-' + matching : ''}</>

describe('WidgetRenderer', () => {
    it('missing type widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    NoWidget: NoWidget,
                    types: {},
                    custom: {},
                    widgetPlugins: [
                        ExtractStorePlugin,
                        WidgetRenderer,
                    ],
                    schemaPlugins: [],
                }}
                value={'demo-value'}
                schema={createOrderedMap({type: 'string'})}
            />,
        )
        // todo: adjust test for 0.5.0
        expect(queryByText('missing-type-string') !== null).toBeTruthy()
    })

    it('missing custom widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    NoWidget: NoWidget,
                    types: {},
                    custom: {},
                    widgetPlugins: [
                        ExtractStorePlugin,
                        WidgetRenderer,
                    ],
                    schemaPlugins: [],
                }}
                value={'demo-value'}
                schema={createOrderedMap({type: 'string', widget: 'Text'})}
            />,
        )
        // todo: adjust test for 0.5.0
        expect(queryByText('missing-custom-Text') !== null).toBeTruthy()
    })

    it('type widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    types: {
                        string: (props: WidgetProps & WithScalarValue) => props.value,
                    },
                    custom: {},
                    widgetPlugins: [
                        ExtractStorePlugin,
                        WidgetRenderer,
                    ],
                    schemaPlugins: [],
                }}
                value={'demo-value'}
                schema={createOrderedMap({type: 'string'})}
            />,
        )
        expect(queryByText('demo-value') !== null).toBeTruthy()
        // todo: adjust test for 0.5.0
        expect(queryByText('missing-type-string') === null).toBeTruthy()
    })

    it('custom widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    types: {},
                    custom: {
                        Text: (props: WidgetProps & WithScalarValue) => props.value,
                    },
                    widgetPlugins: [
                        ExtractStorePlugin,
                        WidgetRenderer,
                    ],
                    schemaPlugins: [],
                }}
                value={'demo-value'}
                schema={createOrderedMap({type: 'string', widget: 'Text'})}
            />,
        )
        expect(queryByText('demo-value') !== null).toBeTruthy()
        // todo: adjust test for 0.5.0
        expect(queryByText('missing-custom-Text') === null).toBeTruthy()
    })

    it('array widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    types: {
                        array: (props: WidgetProps & { value?: unknown }) => typeof props.value === 'undefined' ? 'is-undef' : 'is-set',
                    },
                    custom: {},
                    widgetPlugins: [
                        ExtractStorePlugin,
                        WidgetRenderer,
                    ],
                    schemaPlugins: [],
                }}
                value={[]}
                schema={createOrderedMap({type: 'array'})}
            />,
        )
        // todo: remove experimental 0.5.x
        // expect(queryByText('is-undef') !== null).toBeTruthy()
        expect(queryByText('is-set') !== null).toBeTruthy()
    })

    it('object widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    types: {},
                    custom: {
                        CustomObj: (props: WidgetProps & { value?: unknown }) => typeof props.value === 'undefined' ? 'is-undef' : 'is-set',
                    },
                    widgetPlugins: [
                        ExtractStorePlugin,
                        WidgetRenderer,
                    ],
                    schemaPlugins: [],
                }}
                value={{}}
                schema={createOrderedMap({type: 'object', widget: 'CustomObj'})}
            />,
        )
        // todo: remove experimental 0.5.x
        // expect(queryByText('is-undef') !== null).toBeTruthy()
        expect(queryByText('is-set') !== null).toBeTruthy()
    })

    it('virtual widget object', async () => {
        const value = createOrderedMap({dummy: ['lorem ipsum', 42]})
        const store = createStore(value)
        const {queryByText, queryAllByText} = render(
            // @ts-expect-error
            <UIStoreProvider
                // @ts-expect-error
                store={store}
                // @ts-ignore
                onChange={undefined}
            >
                <WidgetRenderer
                    widgets={{
                        // @ts-ignore
                        RootRenderer: null, GroupRenderer: null, ErrorFallback: () => null,
                        types: {
                            string: () => 'string-renderer',
                            number: () => 'number-renderer',
                        },
                        custom: {},
                        widgetPlugins: [
                            ExtractStorePlugin,
                            WidgetRenderer,
                        ],
                        schemaPlugins: [],
                    }}
                    value={value}
                    virtualWidgets={virtualWidgets}
                    storeKeys={List()}
                    schema={createOrderedMap({
                        type: 'object',
                        properties: {
                            dummy: {
                                type: 'string',
                            },
                            dummy_nr: {
                                type: 'number',
                            },
                        },
                    })}
                    isVirtual
                />
            </UIStoreProvider>,
        )
        expect(queryAllByText('virtual-default-renderer').length === 2).toBeTruthy()
        expect(queryByText('string-renderer') === null).toBeTruthy()
        expect(queryByText('number-renderer') === null).toBeTruthy()
    })

    it('virtual widget object w-values', async () => {
        const virtualWidgets2: VirtualWidgetsMapping = {
            default: virtualWidgets.default_with_id,
            array: VirtualArrayRenderer,
            object: ObjectRenderer,
        }
        const schema = createOrderedMap({
            type: 'object',
            properties: {
                dummy_string: {type: 'string'},
                dummy_string2: {type: 'string'},
            },
        })
        const value = createOrderedMap({
            dummy_string: 'lorem_ipsum',
            dummy_string2: 'dolor_sit',
        })
        const store = createStore(value)
        const {queryByText, container} = render(
            // @ts-expect-error
            <UIStoreProvider
                // @ts-expect-error
                store={store}
                // @ts-ignore
                onChange={undefined}
            >
                <WidgetRenderer
                    widgets={{
                        // @ts-ignore
                        RootRenderer: null, GroupRenderer: null, ErrorFallback: () => null,
                        types: {
                            string: () => 'string-renderer',
                            number: () => 'number-renderer',
                        },
                        custom: {},
                        widgetPlugins: [
                            ExtractStorePlugin,
                            WidgetRenderer,
                        ],
                        schemaPlugins: [],
                    }}
                    value={value}
                    virtualWidgets={virtualWidgets2}
                    storeKeys={List()}
                    schema={schema}
                    isVirtual
                />
            </UIStoreProvider>,
        )
        expect(container.querySelector('#virtual-default-renderer__lorem_ipsum') !== null).toBeTruthy()
        expect(container.querySelector('#virtual-default-renderer__dolor_sit') !== null).toBeTruthy()
        expect(queryByText('string-renderer') === null).toBeTruthy()
        expect(queryByText('number-renderer') === null).toBeTruthy()
    })

    it('virtual widget w-tuple', async () => {
        const virtualWidgets2: VirtualWidgetsMapping = {
            default: virtualWidgets.default,
            array: VirtualArrayRenderer,
            object: ObjectRenderer,
        }
        const widgets: WidgetsBindingFactory = {
            // @ts-ignore
            RootRenderer: null, GroupRenderer: null, ErrorFallback: () => null,
            types: {
                string: () => 'string-renderer',
                number: () => 'number-renderer',
            },
            custom: {},
            widgetPlugins: [
                ExtractStorePlugin,
                WidgetRenderer,
            ],
            schemaPlugins: [],
        }
        const value = createOrderedMap({dummy_array: ['lorem ipsum', 42]})
        const store = createStore(value)
        const {queryByText, queryAllByText} = render(
            // @ts-ignore
            <UIMetaProvider widgets={widgets} t={translateRelative}>
                {/* @ts-expect-error */}
                <UIStoreProvider
                    // @ts-expect-error
                    store={store}
                    // @ts-ignore
                    onChange={undefined}
                >
                    <WidgetRenderer
                        widgets={widgets}
                        value={value}
                        virtualWidgets={virtualWidgets2}
                        storeKeys={List()}
                        schema={createOrderedMap({
                            type: 'object',
                            properties: {
                                dummy: {type: 'string'},
                                dummy_array: {
                                    type: 'array',
                                    items: [
                                        {type: 'string'},
                                        {type: 'number'},
                                    ],
                                },
                            },
                        })}
                        isVirtual
                        internalValue={undefined}
                        t={undefined as any}
                        onChange={undefined as any}
                        required={false}
                        errors={undefined as any}
                    />
                </UIStoreProvider>
            </UIMetaProvider>,
        )
        expect(queryAllByText('virtual-default-renderer').length).toBe(3)
        expect(queryByText('string-renderer') === null).toBeTruthy()
        expect(queryByText('number-renderer') === null).toBeTruthy()
    })

    it('virtual widget w-array', async () => {
        const virtualWidgets2: VirtualWidgetsMapping = {
            default: virtualWidgets.default,
            array: VirtualArrayRenderer,
            object: ObjectRenderer,
        }
        const widgets: WidgetsBindingFactory = {
            // @ts-ignore
            RootRenderer: null, GroupRenderer: null, ErrorFallback: () => null,
            types: {
                string: () => 'string-renderer',
                number: () => 'number-renderer',
            },
            custom: {},
            widgetPlugins: [
                ExtractStorePlugin,
                WidgetRenderer,
            ],
            schemaPlugins: [],
        }
        const value = createOrderedMap({dummy_array: [['lorem ipsum', 42], ['dolor sit', 43]]})
        const store = createStore(value)
        const {queryByText, queryAllByText} = render(
            // @ts-ignore
            <UIMetaProvider widgets={widgets} t={translateRelative}>
                {/* @ts-expect-error */}
                <UIStoreProvider
                    // @ts-expect-error
                    store={store}
                    // @ts-ignore
                    onChange={undefined}
                >
                    <WidgetRenderer<WidgetsBindingFactory, Pick<VirtualWidgetRendererProps, 'virtualWidgets'> & WidgetRendererProps>
                        widgets={widgets}
                        value={value}
                        storeKeys={List()}
                        virtualWidgets={virtualWidgets2}
                        schema={createOrderedMap({
                            type: 'object',
                            properties: {
                                dummy: {type: 'string'},
                                dummy_array: {
                                    type: 'array',
                                    items: {
                                        type: 'array',
                                        items: [
                                            {type: 'string'},
                                            {type: 'number'},
                                        ],
                                    },
                                },
                            },
                        })}
                        isVirtual
                        internalValue={undefined}
                        t={undefined as any}
                        onChange={undefined as any}
                        required={false}
                        errors={undefined as any}
                    />
                </UIStoreProvider>
            </UIMetaProvider>,
        )
        expect(queryAllByText('virtual-default-renderer').length).toBe(5)
        expect(queryByText('string-renderer') === null).toBeTruthy()
        expect(queryByText('number-renderer') === null).toBeTruthy()
    })
})
