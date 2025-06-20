/**
 * @jest-environment jsdom
 */
import { expect, describe, test } from '@jest/globals'
import { render } from '@testing-library/react'
import { SchemaPluginsAdapterBuilder } from '@ui-schema/react/SchemaPluginsAdapter'
import { createOrderedMap } from '@ui-schema/system/createMap'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import { SchemaPluginStack } from '@ui-schema/system/SchemaPluginStack'

describe('SchemaPluginsAdapter', () => {
    test('SchemaPluginsAdapter', async () => {
        const SchemaPluginsAdapter = SchemaPluginsAdapterBuilder([
            {handle: () => ({valid: true})},
        ])
        const {queryByText} = render(
            // @ts-ignore
            <SchemaPluginsAdapter
                // @ts-ignore
                widgets={{
                    types: {
                        string: ({valid}: { valid?: boolean, handled?: boolean }) =>
                            valid ? 'is-valid' : 'is-invalid',
                    },
                    widgetPlugins: [WidgetRenderer],
                }}
                schema={createOrderedMap({type: 'string'})}
                currentPluginIndex={-1}
            />,
        )
        expect(queryByText('is-valid') !== null).toBeTruthy()
    })
})

describe('SchemaPluginStack', () => {
    test.each([
        [{
            widgets: {
                schemaPlugins: [{
                    handle: (): { valid: boolean } => ({valid: true}),
                }],
            },
        }, 'valid', true],
        [{
            widgets: {
                schemaPlugins: [{
                    should: (): boolean => false,
                    handle: (): { valid: boolean } => ({valid: true}),
                }],
            },
        }, 'valid', undefined],
        [{
            widgets: {
                schemaPlugins: [{
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
                schemaPlugins: [{
                    should: (): boolean => true,
                    handle: (): { valid: boolean } => ({valid: true}),
                }],
            },
        }, 'valid', true],
        [{
            widgets: {
                schemaPlugins: [{
                    should: (): boolean => false,
                    handle: (): { valid: boolean } => ({valid: true}),
                    noHandle: (): { valid: number } => ({valid: 100}),
                }],
            },
        }, 'valid', 100],
    ])(
        'SchemaPluginStack(%j): %j, %j',
        (props, keyA: string, expectA: any) => {
            // @ts-ignore
            const newProps = SchemaPluginStack(props, props.widgets?.schemaPlugins)
            // @ts-ignore
            expect(newProps[keyA]).toBe(expectA)
            // @ts-ignore
            // expect(newProps[keyB]).toBe(expectB)
        },
    )
})
