import React from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
// @ts-ignore
import { toBeInTheDocument, toHaveClass } from '@testing-library/jest-dom/matchers'
import { NextPluginRenderer, NextPluginRendererMemo, PluginStack } from '@ui-schema/ui-schema/PluginStack/PluginStack'
import { createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap/createMap'
import { List } from 'immutable'

expect.extend({toBeInTheDocument, toHaveClass})

describe('NextPluginRenderer', () => {
    it('Empty NextPluginRenderer', async () => {
        const {queryByText} = render(
            // @ts-ignore
            <NextPluginRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    types: {}, custom: {},
                    pluginStack: [],
                }}
                currentPluginIndex={-1}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        expect(queryByText('missing-type-string') !== null).toBeTruthy()
    })
    it('Single NextPluginRenderer - current', async () => {
        const {queryByText} = render(
            // @ts-ignore
            <NextPluginRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    types: {}, custom: {},
                    pluginStack: [(p) => <>
                        <span>plugin-1</span>
                        <NextPluginRenderer {...p}/>
                    </>],
                }}
                currentPluginIndex={-1}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        expect(queryByText('plugin-1') !== null).toBeTruthy()
        expect(queryByText('missing-type-string') !== null).toBeTruthy()
    })
    it('Single NextPluginRenderer - current · memo', async () => {
        const {queryByText} = render(
            // @ts-ignore
            <NextPluginRendererMemo
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    types: {}, custom: {},
                    pluginStack: [(p) => <>
                        <span>plugin-1</span>
                        <NextPluginRendererMemo {...p}/>
                    </>],
                }}
                currentPluginIndex={-1}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        expect(queryByText('plugin-1') !== null).toBeTruthy()
        expect(queryByText('missing-type-string') !== null).toBeTruthy()
    })
    it('Single NextPluginRenderer - prev', async () => {
        const {queryByText} = render(
            // @ts-ignore
            <NextPluginRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    types: {}, custom: {},
                    pluginStack: [(p) => <>
                        <span>plugin-1</span>
                        <NextPluginRenderer {...p}/>
                    </>],
                }}
                currentPluginIndex={0}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        expect(queryByText('plugin-1') === null).toBeTruthy()
        expect(queryByText('missing-type-string') !== null).toBeTruthy()
    })
    it('Single NextPluginRenderer - err', async () => {
        const {queryByText} = render(
            // @ts-ignore
            <NextPluginRenderer
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    types: {}, custom: {},
                    // @ts-ignore
                    pluginStack: [undefined],
                }}
                currentPluginIndex={-1}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        expect(queryByText('plugin-error') !== null).toBeTruthy()
        expect(queryByText('missing-type-string') === null).toBeTruthy()
    })
    it('Plugin Stack - noSchema', async () => {
        const {queryByText} = render(
            // @ts-ignore
            <PluginStack
                widgets={{
                    // @ts-ignore
                    RootRenderer: null, GroupRenderer: null, ErrorFallback: null,
                    types: {}, custom: {},
                    // @ts-ignore
                    pluginStack: [() => {
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
