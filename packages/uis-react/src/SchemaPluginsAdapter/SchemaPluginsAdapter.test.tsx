/**
 * @jest-environment jsdom
 */
import React from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
// @ts-ignore
import { toBeInTheDocument, toHaveClass } from '@testing-library/jest-dom/matchers'
import { SchemaPluginsAdapter, handleSchemaPluginsAdapter } from './SchemaPluginsAdapter'
import { createOrderedMap } from '@ui-schema/react/Utils/createMap/createMap'
import { WidgetRenderer } from '../WidgetRenderer/WidgetRenderer'

expect.extend({toBeInTheDocument, toHaveClass})

describe('SchemaPluginsAdapter', () => {
    it('SchemaPluginsAdapter', async () => {
        const {queryByText} = render(
            // ts-@ignore
            <SchemaPluginsAdapter
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
                    schemaPlugins: [{handle: () => ({valid: true})}],
                    widgetPlugins: [],
                }}
                schema={createOrderedMap({type: 'string'})}
            />
        )
        expect(queryByText('is-valid') !== null).toBeTruthy()
    })
})

describe('handleSchemaPluginsAdapter', () => {
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
        'handleSchemaPluginsAdapter(%j): %j, %j',
        (props, keyA: string, expectA: any) => {
            // @ts-ignore
            const newProps = handleSchemaPluginsAdapter(props, props.widgets?.schemaPlugins)
            // @ts-ignore
            expect(newProps[keyA]).toBe(expectA)
            // @ts-ignore
            // expect(newProps[keyB]).toBe(expectB)
        }
    )
})
