/**
 * @jest-environment jsdom
 */
import { NoWidget } from '@ui-schema/react/NoWidget'
import { it, expect, describe, jest } from '@jest/globals'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/jest-globals'
import { NextPluginRenderer, NextPluginRendererMemo, WidgetEngine, WidgetPluginType } from '@ui-schema/react/WidgetEngine'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { StoreKeys } from '@ui-schema/ui-schema/ValueStore'
import { List, OrderedMap } from 'immutable'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'

describe('NextPluginRenderer', () => {
    it('Empty NextPluginRenderer', async () => {
        const {queryByText} = render(
            <NextPluginRenderer
                binding={{
                    NoWidget: NoWidget,
                    widgetPlugins: [
                        WidgetRenderer,
                    ] satisfies WidgetPluginType[],
                }}
                currentPluginIndex={-1}
                schema={createOrderedMap({type: 'string'})}
            />,
        )
        expect(queryByText('missing-type-string') !== null).toBeTruthy()
    })
    it('Single NextPluginRenderer - current', async () => {
        const {queryByText} = render(
            <NextPluginRenderer
                binding={{
                    NoWidget: NoWidget,
                    widgetPlugins: [
                        (p) => <>
                            <span>plugin-1</span>
                            <NextPluginRenderer {...p}/>
                        </>,
                        WidgetRenderer,
                    ] satisfies WidgetPluginType[],
                }}
                currentPluginIndex={-1}
                schema={createOrderedMap({type: 'string'})}
            />,
        )
        expect(queryByText('plugin-1') !== null).toBeTruthy()
        expect(queryByText('missing-type-string') !== null).toBeTruthy()
    })
    it('Single NextPluginRenderer - current · memo', async () => {
        const {queryByText} = render(
            <NextPluginRendererMemo
                binding={{
                    NoWidget: NoWidget,
                    widgetPlugins: [
                        (p) => <>
                            <span>plugin-1</span>
                            <NextPluginRendererMemo {...p}/>
                        </>,
                        WidgetRenderer,
                    ] satisfies WidgetPluginType[],
                }}
                currentPluginIndex={-1}
                schema={createOrderedMap({type: 'string'})}
            />,
        )
        expect(queryByText('plugin-1') !== null).toBeTruthy()
        expect(queryByText('missing-type-string') !== null).toBeTruthy()
    })
    it('Single NextPluginRenderer - prev', async () => {
        const {queryByText} = render(
            <NextPluginRenderer
                binding={{
                    NoWidget: NoWidget,
                    widgetPlugins: [
                        (p) => <>
                            <span>plugin-1</span>
                            <NextPluginRenderer {...p}/>
                        </>,
                        WidgetRenderer,
                    ] satisfies WidgetPluginType[],
                }}
                currentPluginIndex={0} // simulate that the first plugin was already rendered
                schema={createOrderedMap({type: 'string'})}
            />,
        )
        expect(queryByText('plugin-1') === null).toBeTruthy()
        expect(queryByText('missing-type-string') !== null).toBeTruthy()
    })
    it('Single NextPluginRenderer - err', async () => {
        // disable default log inside react lib.
        jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

        await waitFor(
            () => expect(
                () => render(
                    <NextPluginRenderer
                        binding={{
                            NoWidget: NoWidget,
                            widgetPlugins: [
                                (p) => <>
                                    <span>plugin-1</span>
                                    <NextPluginRenderer {...p}/>
                                </>,
                            ] satisfies WidgetPluginType[],
                        }}
                        currentPluginIndex={-1}
                        schema={createOrderedMap({type: 'string'})}
                    />,
                ),
            )
                .toThrow('WidgetPlugin overflow, no plugin at 1.'),
        )

        jest.restoreAllMocks()
    })

    it('Plugin Stack - noSchema', async () => {
        const {queryByText} = render(
            <WidgetEngine
                // @ts-expect-error
                schema={undefined}
                binding={{
                    widgetPlugins: [
                        (() => {
                            throw new Error('dummy-error')
                        }) satisfies WidgetPluginType,
                    ],
                }}
                parentSchema={createOrderedMap({required: ['dummy']})}
                storeKeys={List(['dummy'])}
            />,
        )
        expect(queryByText('error-fallback') === null).toBeTruthy()
    })

    ////
    // new tests for expected WidgetEngine props and types
    // todo: improve with real tests for some results, using mock plugins to dumb the current props,
    //       atm. only used for ensuring types
    // todo: there are special test tools for types, which where awful the last time I tried them,
    //       here the expect-error may hide other errors, as it is not possible to expect specific typescript errors
    //       AND type checking is disabled in jest, but done by normal tscheck
    ////

    const mockSchemaRoot = createOrderedMap({
        type: 'object',
        properties: {dummy: {type: 'string'}},
        required: ['dummy'],
    })
    const mockSchemaField = mockSchemaRoot.getIn(['properties', 'dummy']) as OrderedMap<string, any>
    const storeKeysField = List(['dummy'])

    // standard mode, basics

    it('WidgetEngine - isRoot', async () => {
        const {queryByText} = render(
            <WidgetEngine
                schema={mockSchemaRoot}
                isRoot

                binding={{}} // needed to prevent internals to break without context
            />,
        )
        expect(queryByText('error-fallback') === null).toBeTruthy()
    })

    it('WidgetEngine - not isRoot', async () => {
        const {queryByText} = render(
            <WidgetEngine
                schema={mockSchemaField}
                parentSchema={mockSchemaRoot}
                storeKeys={storeKeysField}

                binding={{}} // needed to prevent internals to break without context
            />,
        )
        expect(queryByText('error-fallback') === null).toBeTruthy()
    })

    it('WidgetEngine - not isRoot - missing props', async () => {
        const {queryByText} = render(
            // @ts-expect-error missing storeKeys
            <WidgetEngine
                schema={mockSchemaField}

                binding={{}} // needed to prevent internals to break without context
            />,
        )
        expect(queryByText('error-fallback') === null).toBeTruthy()
    })

    // standard mode w/ custom props: forbidden vs allowed

    it('WidgetEngine - standard, custom props forbidden', async () => {
        const {queryByText} = render(
            <WidgetEngine
                schema={mockSchemaField}
                parentSchema={mockSchemaRoot}
                storeKeys={storeKeysField}

                // @ts-expect-error not defined and NoInfer should catch it
                className={'some-class'}

                binding={{}} // needed to prevent internals to break without context
            />,
        )
        expect(queryByText('error-fallback') === null).toBeTruthy()
    })

    it('WidgetEngine - standard, custom props allowed, specified', async () => {
        const {queryByText} = render(
            <WidgetEngine<{ className: string }>
                schema={mockSchemaField}
                parentSchema={mockSchemaRoot}
                storeKeys={storeKeysField}

                className={'some-class'}

                binding={{}} // needed to prevent internals to break without context
            />,
        )
        expect(queryByText('error-fallback') === null).toBeTruthy()
    })

    it('WidgetEngine - standard, custom props allowed, missing', async () => {
        const {queryByText} = render(
            // @ts-expect-error missing className
            <WidgetEngine<
                    { className: string }
                >
                schema={mockSchemaField}
                parentSchema={mockSchemaRoot}
                storeKeys={storeKeysField}

                binding={{}} // needed to prevent internals to break without context
            />,
        )
        expect(queryByText('error-fallback') === null).toBeTruthy()
    })

    // WidgetOverride w/ standard widget, no extra props
    // WidgetOverride w/ widget, w/ extra props: optional and required props
    // WidgetOverride w/ standard widget + custom props: forbidden vs allowed
    // todo: + ui context
    // todo: + stack wrapper context (if not deprecated/removed)
    // todo: + widgets bindings / UIMeta context inference

    const CustomWidgetNoCustomProps = ({storeKeys}: { storeKeys: StoreKeys }) => {
        return <span data-path={storeKeys.join('.')}>{'CustomWidgetNoCustomProps'}</span>
    }

    const CustomWidgetOptionalProps = ({storeKeys, className}: { storeKeys: StoreKeys, className?: string }) => {
        return <span className={className} data-path={storeKeys.join('.')}>{'CustomWidgetOptionalProps'}</span>
    }

    const CustomWidgetRequiredProps = ({storeKeys, className}: { storeKeys: StoreKeys, className: string }) => {
        return <span className={className} data-path={storeKeys.join('.')}>{'CustomWidgetRequiredProps'}</span>
    }

    // todo: all this should be possible without `typeof Component` in generics
    it('WidgetEngine - custom, no custom props', async () => {
        const {queryByText} = render(
            <WidgetEngine<object, typeof CustomWidgetNoCustomProps>
                schema={mockSchemaField}
                parentSchema={mockSchemaRoot}
                storeKeys={storeKeysField}

                WidgetOverride={CustomWidgetNoCustomProps}

                // @ts-expect-error not defined and NoInfer should catch it
                className={'some-class'}

                binding={{}} // needed to prevent internals to break without context
            />,
        )
        expect(queryByText('error-fallback') === null).toBeTruthy()
    })

    it('WidgetEngine - custom, custom props allowed, optional', async () => {
        const {queryByText} = render(
            <WidgetEngine<object, typeof CustomWidgetOptionalProps>
                schema={mockSchemaField}
                parentSchema={mockSchemaRoot}
                storeKeys={storeKeysField}

                WidgetOverride={CustomWidgetOptionalProps}
                className={'some-class'}

                binding={{}} // needed to prevent internals to break without context
            />,
        )
        expect(queryByText('error-fallback') === null).toBeTruthy()
    })

    it('WidgetEngine - custom, custom props allowed, required', async () => {
        const {queryByText} = render(
            // @ts-expect-error missing className
            <WidgetEngine<
                    object,
                    typeof CustomWidgetRequiredProps
                >
                schema={mockSchemaField}
                parentSchema={mockSchemaRoot}
                storeKeys={storeKeysField}
                WidgetOverride={CustomWidgetRequiredProps}

                binding={{}} // needed to prevent internals to break without context
            />,
        )
        expect(queryByText('error-fallback') === null).toBeTruthy()
    })
})
