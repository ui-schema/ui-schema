/**
 * @jest-environment jsdom
 */
import { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import { matchWidget } from '@ui-schema/ui-schema/matchWidget'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/jest-globals'
import { WidgetRenderer, WidgetRendererProps } from '@ui-schema/react/WidgetRenderer'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { VirtualArrayRenderer, VirtualWidgetRenderer, VirtualWidgetRendererProps, VirtualWidgetsMapping } from '@ui-schema/react-json-schema/VirtualWidgetRenderer'
import { WidgetProps, WidgetsBindingFactory } from '@ui-schema/react/Widgets'
import { ObjectRendererBase as ObjectRenderer } from '@ui-schema/react-json-schema/ObjectRenderer'
import { List } from 'immutable'
import { createStore, onChangeHandler, UIStoreProvider } from '@ui-schema/react/UIStore'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { translateRelative } from '@ui-schema/ui-schema/TranslatorRelative'

export const virtualWidgets: VirtualWidgetsMapping & { default_with_id: VirtualWidgetsMapping['default'] } = {
    'default': () => {
        return <span>virtual-default-renderer</span>
    },
    'default_with_id': ({value}) => {
        return <span id={'virtual-default-renderer__' + value}/>
    },
    'object': ObjectRenderer,
    'array': () => <span>virtual-array-renderer</span>,
}

const mockProps = {
    storeKeys: List([]),
    internalValue: undefined,
    onChange: undefined as unknown as onChangeHandler,
    t: text => text,
}

describe('WidgetRenderer', () => {
    it('virtual widget object', async () => {
        const value = createOrderedMap({dummy: ['lorem ipsum', 42]})
        const store = createStore(value)
        const widgets = {
            VirtualRenderer: VirtualWidgetRenderer,
            widgets: {
                string: () => 'string-renderer',
                number: () => 'number-renderer',
            },
            WidgetRenderer: WidgetRenderer,
        }
        const {queryByText, queryAllByText} = render(
            <UIMetaProvider binding={widgets} t={translateRelative}>
                <UIStoreProvider
                    store={store}
                    onChange={undefined as any}
                >
                    <WidgetRenderer<UIStoreActions, {}, { virtualWidgets: typeof virtualWidgets } & WidgetProps>
                        binding={widgets}
                        value={value}
                        virtualWidgets={virtualWidgets}
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
                        {...mockProps}
                    />
                </UIStoreProvider>
            </UIMetaProvider>,
        )
        expect(queryAllByText('virtual-default-renderer').length).toBe(2)
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
        const widgets = {
            VirtualRenderer: VirtualWidgetRenderer,
            widgets: {
                string: () => 'string-renderer',
                number: () => 'number-renderer',
            },
            widgetPlugins: [],
            WidgetRenderer: WidgetRenderer,
        }
        const {queryByText, container} = render(
            <UIMetaProvider binding={widgets} t={translateRelative}>
                <UIStoreProvider
                    store={store}
                    onChange={undefined as any}
                >
                    <WidgetRenderer<UIStoreActions, {}, { virtualWidgets: typeof virtualWidgets2 } & WidgetProps>
                        binding={widgets}
                        value={value}
                        virtualWidgets={virtualWidgets2}
                        schema={schema}
                        isVirtual
                        {...mockProps}
                    />
                </UIStoreProvider>
            </UIMetaProvider>,
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
            VirtualRenderer: VirtualWidgetRenderer,
            widgets: {
                string: () => 'string-renderer',
                number: () => 'number-renderer',
            },
            widgetPlugins: [],
            WidgetRenderer: WidgetRenderer,
            matchWidget: matchWidget,
        }
        const value = createOrderedMap({dummy_array: ['lorem ipsum', 42]})
        const store = createStore(value)
        const {queryByText, queryAllByText} = render(
            <UIMetaProvider binding={widgets} t={translateRelative}>
                <UIStoreProvider
                    store={store}
                    onChange={undefined as any}
                >
                    <WidgetRenderer<UIStoreActions, {}, { virtualWidgets: typeof virtualWidgets2 } & WidgetProps<typeof widgets>>
                        binding={widgets}
                        value={value}
                        virtualWidgets={virtualWidgets2}
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
                        {...mockProps}
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
            VirtualRenderer: VirtualWidgetRenderer,
            widgets: {
                string: () => 'string-renderer',
                number: () => 'number-renderer',
            },
            WidgetRenderer: WidgetRenderer,
            matchWidget: matchWidget,
        }
        const value = createOrderedMap({dummy_array: [['lorem ipsum', 42], ['dolor sit', 43]]})
        const store = createStore(value)
        const {queryByText, queryAllByText} = render(
            <UIMetaProvider binding={widgets} t={translateRelative}>
                <UIStoreProvider
                    store={store}
                    onChange={undefined as any}
                >
                    <WidgetRenderer<UIStoreActions, {}, Pick<VirtualWidgetRendererProps, 'virtualWidgets'> & WidgetRendererProps>
                        binding={widgets}
                        value={value}
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
                        {...mockProps}
                    />
                </UIStoreProvider>
            </UIMetaProvider>,
        )
        expect(queryAllByText('virtual-default-renderer').length).toBe(5)
        expect(queryByText('string-renderer') === null).toBeTruthy()
        expect(queryByText('number-renderer') === null).toBeTruthy()
    })
})
