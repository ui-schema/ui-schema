/**
 * @jest-environment jsdom
 */
import React from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
// @ts-ignore
import { toBeInTheDocument, toHaveClass } from '@testing-library/jest-dom/matchers'
import { WidgetRenderer } from './WidgetRenderer'
import { createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap/createMap'
import { VirtualWidgetsMapping, WidgetProps } from '@ui-schema/ui-schema'
import { VirtualArrayRenderer } from '@ui-schema/ui-schema/WidgetRenderer/VirtualWidgetRenderer'
import { ObjectRenderer } from '@ui-schema/ui-schema/ObjectRenderer/ObjectRenderer'
import { List } from 'immutable'
import { ExtractStorePlugin } from '@ui-schema/ui-schema/Plugins/ExtractStorePlugin'
import { createStore, UIStoreProvider } from '@ui-schema/ui-schema/UIStore'
import { UIMetaProvider } from '@ui-schema/ui-schema/UIMeta'
import { relTranslator } from '@ui-schema/ui-schema/Translate/relT/relT'

expect.extend({toBeInTheDocument, toHaveClass})

export const virtualWidgets: VirtualWidgetsMapping = {
    // eslint-disable-next-line react/display-name
    'default': () => <span>virtual-default-renderer</span>,
    // @ts-ignore
    // eslint-disable-next-line react/display-name
    'default_w_suffix': ({value}) => <span id={'virtual-default-renderer__' + value}/>,
    // eslint-disable-next-line react/display-name
    'object': ObjectRenderer,
    // eslint-disable-next-line react/display-name
    'array': () => <span>virtual-array-renderer</span>,
}

describe('WidgetRenderer', () => {
    it('missing type widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    WidgetRenderer: WidgetRenderer,
                    types: {}, custom: {},
                    pluginStack: [ExtractStorePlugin],
                    pluginSimpleStack: [],
                }}
                value={'demo-value'}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        expect(queryByText('missing-type-string') !== null).toBeTruthy()
    })

    it('missing custom widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    WidgetRenderer: WidgetRenderer,
                    types: {}, custom: {},
                    pluginStack: [ExtractStorePlugin],
                    pluginSimpleStack: [],
                }}
                value={'demo-value'}
                schema={createOrderedMap({type: 'string', widget: 'Text'})}
            />
        )
        expect(queryByText('missing-custom-Text') !== null).toBeTruthy()
    })

    it('type widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    WidgetRenderer: WidgetRenderer,
                    types: {string: (props: WidgetProps) => props.value}, custom: {},
                    pluginStack: [ExtractStorePlugin],
                    pluginSimpleStack: [],
                }}
                value={'demo-value'}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        expect(queryByText('demo-value') !== null).toBeTruthy()
        expect(queryByText('missing-type-string') === null).toBeTruthy()
    })

    it('custom widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    WidgetRenderer: WidgetRenderer,
                    types: {}, custom: {Text: (props: WidgetProps) => props.value},
                    pluginStack: [ExtractStorePlugin],
                    pluginSimpleStack: [],
                }}
                value={'demo-value'}
                schema={createOrderedMap({type: 'string', widget: 'Text'})}
            />
        )
        expect(queryByText('demo-value') !== null).toBeTruthy()
        expect(queryByText('missing-custom-Text') === null).toBeTruthy()
    })

    it('array widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    WidgetRenderer: WidgetRenderer,
                    types: {array: (props: WidgetProps) => typeof props.value === 'undefined' ? 'is-undef' : 'is-set'}, custom: {},
                    pluginStack: [ExtractStorePlugin],
                    pluginSimpleStack: [],
                }}
                value={[]}
                schema={createOrderedMap({type: 'array'})}
            />
        )
        expect(queryByText('is-undef') !== null).toBeTruthy()
    })

    it('object widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    WidgetRenderer: WidgetRenderer,
                    types: {},
                    custom: {CustomObj: (props: WidgetProps) => typeof props.value === 'undefined' ? 'is-undef' : 'is-set'},
                    pluginStack: [ExtractStorePlugin],
                    pluginSimpleStack: [],
                }}
                value={{}}
                schema={createOrderedMap({type: 'object', widget: 'CustomObj'})}
            />
        )
        expect(queryByText('is-undef') !== null).toBeTruthy()
    })

    it('virtual widget object', async () => {
        const value = createOrderedMap({dummy: ['lorem ipsum', 42]})
        const store = createStore(value)
        const {queryByText, queryAllByText} = render(
            <UIStoreProvider
                store={store}
                // @ts-ignore
                onChange={undefined}
            >
                <WidgetRenderer
                    widgets={{
                        // @ts-ignore
                        RootRenderer: null, GroupRenderer: null, ErrorFallback: () => null,
                        WidgetRenderer: WidgetRenderer,
                        types: {string: () => 'string-renderer', number: () => 'number-renderer'},
                        custom: {},
                        pluginStack: [ExtractStorePlugin],
                        pluginSimpleStack: [],
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
            </UIStoreProvider>
        )
        expect(queryAllByText('virtual-default-renderer').length === 2).toBeTruthy()
        expect(queryByText('string-renderer') === null).toBeTruthy()
        expect(queryByText('number-renderer') === null).toBeTruthy()
    })

    it('virtual widget object w-values', async () => {
        const virtualWidgets2: VirtualWidgetsMapping = {
            default: virtualWidgets.default_w_suffix,
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
            <UIStoreProvider
                store={store}
                // @ts-ignore
                onChange={undefined}
            >
                <WidgetRenderer
                    widgets={{
                        // @ts-ignore
                        RootRenderer: null, GroupRenderer: null, ErrorFallback: () => null,
                        WidgetRenderer: WidgetRenderer,
                        types: {string: () => 'string-renderer', number: () => 'number-renderer'},
                        custom: {},
                        pluginStack: [ExtractStorePlugin],
                        pluginSimpleStack: [],
                    }}
                    value={value}
                    virtualWidgets={virtualWidgets2}
                    storeKeys={List()}
                    schema={schema}
                    isVirtual
                />
            </UIStoreProvider>
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
        const widgets = {
            // @ts-ignore
            RootRenderer: null, GroupRenderer: null, ErrorFallback: () => null,
            WidgetRenderer: WidgetRenderer,
            types: {string: () => 'string-renderer', number: () => 'number-renderer'},
            custom: {},
            pluginStack: [ExtractStorePlugin],
            pluginSimpleStack: [],
        }
        const value = createOrderedMap({dummy_array: ['lorem ipsum', 42]})
        const store = createStore(value)
        const {queryByText, queryAllByText} = render(
            // @ts-ignore
            <UIMetaProvider widgets={widgets} t={relTranslator}>
                <UIStoreProvider
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
                    />
                </UIStoreProvider>
            </UIMetaProvider>
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
        const widgets = {
            // @ts-ignore
            RootRenderer: null, GroupRenderer: null, ErrorFallback: () => null,
            WidgetRenderer: WidgetRenderer,
            types: {string: () => 'string-renderer', number: () => 'number-renderer'},
            custom: {},
            pluginStack: [ExtractStorePlugin],
            pluginSimpleStack: [],
        }
        const value = createOrderedMap({dummy_array: [['lorem ipsum', 42], ['dolor sit', 43]]})
        const store = createStore(value)
        const {queryByText, queryAllByText} = render(
            // @ts-ignore
            <UIMetaProvider widgets={widgets} t={relTranslator}>
                <UIStoreProvider
                    store={store}
                    // @ts-ignore
                    onChange={undefined}
                >
                    <WidgetRenderer
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
                    />
                </UIStoreProvider>
            </UIMetaProvider>
        )
        expect(queryAllByText('virtual-default-renderer').length).toBe(5)
        expect(queryByText('string-renderer') === null).toBeTruthy()
        expect(queryByText('number-renderer') === null).toBeTruthy()
    })
})
