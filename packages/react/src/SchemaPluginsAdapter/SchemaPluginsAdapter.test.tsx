/**
 * @jest-environment jsdom
 */
import { expect, describe, test } from '@jest/globals'
import { render } from '@testing-library/react'
import { schemaPluginsAdapterBuilder } from '@ui-schema/react/SchemaPluginsAdapter'
import { BindingTypeGeneric } from '@ui-schema/react/Widget'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { SchemaPlugin, SchemaPluginProps } from '@ui-schema/ui-schema/SchemaPlugin'
import { SchemaPluginStack } from '@ui-schema/ui-schema/SchemaPluginStack'
import { List, OrderedMap } from 'immutable'

describe('SchemaPluginsAdapter', () => {
    test('SchemaPluginsAdapter', async () => {
        const SchemaPluginsAdapter = schemaPluginsAdapterBuilder([
            {handle: () => ({valid: true})},
        ])
        const {queryByText} = render(
            <SchemaPluginsAdapter
                binding={{}}
                schema={createOrderedMap({type: 'string'})}
                storeKeys={List()}
                value={undefined}
                internalValue={undefined}
                onChange={undefined as any}
                t={text => text}
                Next={{
                    name: 'MockWidgetNext',
                    plugin: null,
                    index: -1,
                    Component:
                        ({valid}: { valid?: boolean, handled?: boolean }) =>
                            valid ? 'is-valid' : 'is-invalid',
                }}
            />,
        )
        expect(queryByText('is-valid') !== null).toBeTruthy()
    })
})

describe('SchemaPluginStack', () => {
    // basic props, which exist on type but don't influence behaviour
    const schemaPluginProps = {
        storeKeys: List<string | number>([]),
        schema: OrderedMap<string | number, any>(),
    }
    const testCases: [SchemaPluginProps & { binding?: BindingTypeGeneric & { schemaPlugins?: SchemaPlugin<any>[] } }, string, unknown][] = [
        [{
            binding: {
                schemaPlugins: [{
                    handle: (): { valid: boolean } => ({valid: true}),
                }],
            },
            ...schemaPluginProps,
        }, 'valid', true],
        [{
            binding: {
                schemaPlugins: [{
                    should: (): boolean => false,
                    handle: (): { valid: boolean } => ({valid: true}),
                }],
            },
            ...schemaPluginProps,
        }, 'valid', undefined],
        [{
            binding: {
                // @ts-expect-error missing handle
                schemaPlugins: [{
                    should: (): boolean => true,
                }],
            },
            ...schemaPluginProps,
        }, 'valid', undefined],
        [{
            binding: {},
            ...schemaPluginProps,
        }, 'valid', undefined],
        [schemaPluginProps, 'valid', undefined],
        [{
            binding: {
                schemaPlugins: [{
                    should: (): boolean => true,
                    handle: (): { valid: boolean } => ({valid: true}),
                }],
            },
            ...schemaPluginProps,
        }, 'valid', true],
        [{
            binding: {
                schemaPlugins: [{
                    should: (): boolean => false,
                    handle: (): { valid: boolean } => ({valid: true}),
                    noHandle: (): { valid: number } => ({valid: 100}),
                }],
            },
            ...schemaPluginProps,
        }, 'valid', 100],
    ]
    test.each(testCases)(
        'SchemaPluginStack(%j): %j, %j',
        (props, keyA: string, expectA: any) => {
            const newProps = SchemaPluginStack(
                props,
                props.binding?.schemaPlugins || [],
            )
            expect(newProps[keyA]).toBe(expectA)
        },
    )
})
