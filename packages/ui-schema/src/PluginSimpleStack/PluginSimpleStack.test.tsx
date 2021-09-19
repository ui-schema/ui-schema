/**
 * @jest-environment jsdom
 */
import React from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
// @ts-ignore
import { toBeInTheDocument, toHaveClass } from '@testing-library/jest-dom/matchers'
import { PluginSimpleStack, handlePluginSimpleStack } from './PluginSimpleStack'
import { createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap/createMap'
import { WidgetRenderer } from '../WidgetRenderer/WidgetRenderer'

expect.extend({toBeInTheDocument, toHaveClass})

describe('PluginSimpleStack', () => {
    it('PluginSimpleStack', async () => {
        const {queryByText} = render(
            // ts-@ignore
            <PluginSimpleStack
                // ts-@ignore
                handled
                // ts-@ignore
                widgets={{
                    WidgetRenderer: WidgetRenderer,
                    types: {
                        // @ts-ignore
                        string: ({valid, handled}: { valid?: boolean, handled?: boolean }) =>
                            valid === true && handled === true ? 'is-valid' : 'is-invalid',
                    },
                    pluginSimpleStack: [{handle: () => ({valid: true})}],
                    pluginStack: [],
                }}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        expect(queryByText('is-valid') !== null).toBeTruthy()
    })
})

describe('handlePluginSimpleStack', () => {
    test.each([
        [{
            widgets: {
                pluginSimpleStack: [{
                    handle: (): { valid: boolean } => ({valid: true}),
                }],
            },
        }, 'valid', true],
        [{
            widgets: {
                pluginSimpleStack: [{
                    should: (): boolean => false,
                    handle: (): { valid: boolean } => ({valid: true}),
                }],
            },
        }, 'valid', undefined],
        [{
            widgets: {
                pluginSimpleStack: [{
                    should: (): boolean => true,
                }],
            },
        }, 'valid', undefined],
        [{
            widgets: {},
        }, 'valid', undefined],
        [{}, 'valid', undefined],
        [{
            widgets: {
                pluginSimpleStack: [{
                    should: (): boolean => true,
                    handle: (): { valid: boolean } => ({valid: true}),
                }],
            },
        }, 'valid', true],
        [{
            widgets: {
                pluginSimpleStack: [{
                    should: (): boolean => false,
                    handle: (): { valid: boolean } => ({valid: true}),
                    noHandle: (): { valid: number } => ({valid: 100}),
                }],
            },
        }, 'valid', 100],
    ])(
        'handlePluginSimpleStack(%j): %j, %j',
        (props, keyA: string, expectA: any) => {
            // @ts-ignore
            const newProps = handlePluginSimpleStack(props, props.widgets?.pluginSimpleStack)
            // @ts-ignore
            expect(newProps[keyA]).toBe(expectA)
            // @ts-ignore
            // expect(newProps[keyB]).toBe(expectB)
        }
    )
})
