/**
 * @jest-environment jsdom
 */
import { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import { widgetMatcher } from '@ui-schema/ui-schema/widgetMatcher'
import { ReactNode } from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/jest-globals'
import { WidgetRenderer, WidgetRendererProps } from './WidgetRenderer.js'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { VirtualArrayRenderer, VirtualWidgetRendererProps, VirtualWidgetsMapping } from '@ui-schema/react/VirtualWidgetRenderer'
import { NoWidgetProps, WidgetProps, WidgetPropsComplete, WidgetsBindingFactory } from '@ui-schema/react/Widgets'
import { ObjectRenderer } from '@ui-schema/react-json-schema/ObjectRenderer'
import { List } from 'immutable'
import { createStore, onChangeHandler, UIStoreProvider, WithScalarValue } from '@ui-schema/react/UIStore'
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

const NoWidget = ({scope, matching}: NoWidgetProps): ReactNode => <>missing-{scope}{matching ? '-' + matching : ''}</>

const mockProps = {
    storeKeys: List([]),
    internalValue: undefined,
    onChange: undefined as unknown as onChangeHandler,
}

describe('WidgetRenderer', () => {
    it('missing type widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                binding={{
                    NoWidget: NoWidget,
                    // widgetPlugins: [
                    //     WidgetRenderer,
                    // ],
                }}
                value={'demo-value'}
                schema={createOrderedMap({type: 'string'})}
                {...mockProps}
            />,
        )
        expect(queryByText('missing-type-string') !== null).toBeTruthy()
    })

    it('missing custom widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                binding={{
                    NoWidget: NoWidget,
                    // widgetPlugins: [
                    //     WidgetRenderer,
                    // ],
                }}
                value={'demo-value'}
                schema={createOrderedMap({type: 'string', widget: 'Text'})}
                {...mockProps}
            />,
        )
        expect(queryByText('missing-custom-Text') !== null).toBeTruthy()
    })

    it('type widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                binding={{
                    widgets: {
                        types: {
                            string: (props: WidgetProps & WithScalarValue) => props.value,
                        },
                    },
                    // widgetPlugins: [
                    //     WidgetRenderer,
                    // ],
                }}
                value={'demo-value'}
                schema={createOrderedMap({type: 'string'})}
                {...mockProps}
            />,
        )
        expect(queryByText('demo-value') !== null).toBeTruthy()
        expect(queryByText('missing-type-string') === null).toBeTruthy()
    })

    it('custom widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                binding={{
                    widgets: {
                        custom: {
                            Text: (props: WidgetProps & WithScalarValue) => props.value,
                        },
                    },
                    // widgetPlugins: [
                    //     WidgetRenderer,
                    // ],
                }}
                value={'demo-value'}
                schema={createOrderedMap({type: 'string', widget: 'Text'})}
                {...mockProps}
            />,
        )
        expect(queryByText('demo-value') !== null).toBeTruthy()
        expect(queryByText('missing-custom-Text') === null).toBeTruthy()
    })

    it('array widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                binding={{
                    widgets: {
                        types: {
                            array: (props: WidgetProps & { value?: unknown }) => typeof props.value === 'undefined' ? 'is-undef' : 'is-set',
                        },
                    },
                    // widgetPlugins: [
                    //     WidgetRenderer,
                    // ],
                }}
                value={[]}
                schema={createOrderedMap({type: 'array'})}
                {...mockProps}
            />,
        )
        // todo: remove experimental 0.5.x
        // expect(queryByText('is-undef') !== null).toBeTruthy()
        expect(queryByText('is-set') !== null).toBeTruthy()
    })

    it('object widget', async () => {
        const {queryByText} = render(
            <WidgetRenderer
                binding={{
                    widgets: {
                        custom: {
                            CustomObj: (props: WidgetProps & { value?: unknown }) => typeof props.value === 'undefined' ? 'is-undef' : 'is-set',
                        },
                    },
                    // widgetPlugins: [
                    //     WidgetRenderer,
                    // ],
                }}
                value={{}}
                schema={createOrderedMap({type: 'object', widget: 'CustomObj'})}
                {...mockProps}
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
                <WidgetRenderer<UIStoreActions, { virtualWidgets: typeof virtualWidgets } & WidgetPropsComplete>
                    binding={{
                        widgets: {
                            types: {
                                string: () => 'string-renderer',
                                number: () => 'number-renderer',
                            },
                        },
                        // @ts-expect-error expand typing or use meta provider? virtual relies on WidgetEngine,
                        // thus requires a `WidgetRenderer` for nested rendering
                        widgetPlugins: [
                            WidgetRenderer,
                        ],
                    }}
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
                <WidgetRenderer<UIStoreActions, { virtualWidgets: typeof virtualWidgets2 } & WidgetPropsComplete>
                    binding={{
                        widgets: {
                            types: {
                                string: () => 'string-renderer',
                                number: () => 'number-renderer',
                            },
                            custom: {},
                        },
                        // @ts-expect-error expand typing or use meta provider? virtual relies on WidgetEngine,
                        // thus requires a `WidgetRenderer` for nested rendering
                        widgetPlugins: [
                            WidgetRenderer,
                        ],
                    }}
                    value={value}
                    virtualWidgets={virtualWidgets2}
                    schema={schema}
                    isVirtual
                    {...mockProps}
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
            widgets: {
                types: {
                    string: () => 'string-renderer',
                    number: () => 'number-renderer',
                },
            },
            widgetPlugins: [
                WidgetRenderer,
            ],
            matchWidget: widgetMatcher,
        }
        const value = createOrderedMap({dummy_array: ['lorem ipsum', 42]})
        const store = createStore(value)
        const {queryByText, queryAllByText} = render(
            <UIMetaProvider binding={widgets} t={translateRelative}>
                {/* @ts-expect-error */}
                <UIStoreProvider
                    // @ts-expect-error
                    store={store}
                    // @ts-ignore
                    onChange={undefined}
                >
                    <WidgetRenderer<UIStoreActions, { virtualWidgets: typeof virtualWidgets2 } & WidgetPropsComplete>
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
            widgets: {
                types: {
                    string: () => 'string-renderer',
                    number: () => 'number-renderer',
                },
            },
            widgetPlugins: [
                WidgetRenderer,
            ],
            matchWidget: widgetMatcher,
        }
        const value = createOrderedMap({dummy_array: [['lorem ipsum', 42], ['dolor sit', 43]]})
        const store = createStore(value)
        const {queryByText, queryAllByText} = render(
            <UIMetaProvider binding={widgets} t={translateRelative}>
                {/* @ts-expect-error */}
                <UIStoreProvider
                    // @ts-expect-error
                    store={store}
                    // @ts-ignore
                    onChange={undefined}
                >
                    <WidgetRenderer<UIStoreActions, Pick<VirtualWidgetRendererProps, 'virtualWidgets'> & WidgetRendererProps>
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
