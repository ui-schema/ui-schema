/**
 * @jest-environment jsdom
 */
import React from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
// @ts-ignore
import { toBeInTheDocument, toHaveClass } from '@testing-library/jest-dom/matchers'
import { NextPluginRenderer, NextPluginRendererMemo, WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { createOrderedMap } from '@ui-schema/system/createMap'
import { List } from 'immutable'
import { WidgetRenderer } from '@ui-schema/ui-schema'

expect.extend({toBeInTheDocument, toHaveClass})

describe('NextPluginRenderer', () => {
    it('Empty NextPluginRenderer', async () => {
        const {queryByText} = render(
            // @ts-ignore
            <NextPluginRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    WidgetRenderer: WidgetRenderer,
                    types: {}, custom: {},
                    widgetPlugins: [],
                }}
                currentPluginIndex={-1}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        // todo: adjust test for 0.5.0
        expect(queryByText('missing-type-string') !== null).toBeTruthy()
    })
    it('Single NextPluginRenderer - current', async () => {
        const {queryByText} = render(
            // @ts-ignore
            <NextPluginRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    WidgetRenderer: WidgetRenderer,
                    types: {}, custom: {},
                    widgetPlugins: [(p) => <>
                        <span>plugin-1</span>
                        <NextPluginRenderer {...p}/>
                    </>],
                }}
                currentPluginIndex={-1}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        expect(queryByText('plugin-1') !== null).toBeTruthy()
        // todo: adjust test for 0.5.0
        expect(queryByText('missing-type-string') !== null).toBeTruthy()
    })
    it('Single NextPluginRenderer - current · memo', async () => {
        const {queryByText} = render(
            // @ts-ignore
            <NextPluginRendererMemo
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    WidgetRenderer: WidgetRenderer,
                    types: {}, custom: {},
                    widgetPlugins: [(p) => <>
                        <span>plugin-1</span>
                        <NextPluginRendererMemo {...p}/>
                    </>],
                }}
                currentPluginIndex={-1}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        expect(queryByText('plugin-1') !== null).toBeTruthy()
        // todo: adjust test for 0.5.0
        expect(queryByText('missing-type-string') !== null).toBeTruthy()
    })
    it('Single NextPluginRenderer - prev', async () => {
        const {queryByText} = render(
            // @ts-ignore
            <NextPluginRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    WidgetRenderer: WidgetRenderer,
                    types: {}, custom: {},
                    widgetPlugins: [(p) => <>
                        <span>plugin-1</span>
                        <NextPluginRenderer {...p}/>
                    </>],
                }}
                currentPluginIndex={0}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        expect(queryByText('plugin-1') === null).toBeTruthy()
        // todo: adjust test for 0.5.0
        expect(queryByText('missing-type-string') !== null).toBeTruthy()
    })
    it('Single NextPluginRenderer - err', async () => {
        const {queryByText} = render(
            // @ts-ignore
            <NextPluginRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    WidgetRenderer: WidgetRenderer,
                    types: {}, custom: {},
                    // @ts-ignore
                    widgetPlugins: [undefined],
                }}
                currentPluginIndex={-1}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        // todo: this must test on exception now
        expect(queryByText('plugin-error') !== null).toBeTruthy()
        // todo: adjust test for 0.5.0
        expect(queryByText('missing-type-string') === null).toBeTruthy()
    })
    it('Plugin Stack - noSchema', async () => {
        const {queryByText} = render(
            // @ts-ignore
            <WidgetEngine
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    WidgetRenderer: WidgetRenderer,
                    types: {}, custom: {},
                    // @ts-ignore
                    widgetPlugins: [() => {
                        throw new Error('dummy-error')
                    }],
                }}
                parentSchema={createOrderedMap({required: ['dummy']})}
                storeKeys={List(['dummy'])}
            />
        )
        expect(queryByText('error-fallback') === null).toBeTruthy()
    })
})
