import { describe, expect, test } from '@jest/globals'
import { getOptionsFromSchema, OptionValueSchema } from '@ui-schema/ds-material/Utils/useOptionsFromSchema'
import { StoreKeys } from '@ui-schema/ui-schema/ValueStore'
import { createOrdered } from '@ui-schema/ui-schema/createMap'
import { List } from 'immutable'
import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'

/**
 * npm run tdd -- --testPathPattern=useOptionsFromSchema.test.ts --selectProjects=test-@ui-schema/ds-material
 */

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const mocksFolder = path.join(__dirname, '../../', 'tests/mocks')

const readSchema = (filename: string) => {
    return fs.readFile(path.join(mocksFolder, filename)).then(b => JSON.parse(b.toString()))
}

describe('useOptionsFromSchema', () => {
    const testCases: (({ schema: any } | { file: string }) & { name: string, storeKeys: StoreKeys, expected: { enumValues: any[] | undefined, valueSchemas: OptionValueSchema<any>[] | undefined } })[] = [
        {
            name: 'undefined schema',
            storeKeys: List(['field']),
            schema: undefined,
            expected: {
                enumValues: undefined,
                valueSchemas: undefined,
            },
        },
        {
            name: 'schema with no options',
            storeKeys: List(['field']),
            schema: {type: 'string'},
            expected: {
                enumValues: undefined,
                valueSchemas: undefined,
            },
        },
        {
            name: 'simple string enum',
            storeKeys: List(['field']),
            schema: {
                type: 'string',
                enum: ['a', 'b'],
            },
            expected: {
                enumValues: ['a', 'b'],
                valueSchemas: [
                    // @ts-ignore
                    {value: 'a', text: 'widget.field.enum.a', fallback: 'A', context: {relative: ['enum', 'a']}, schema: {type: 'string', enum: ['a', 'b']}},
                    // @ts-ignore
                    {value: 'b', text: 'widget.field.enum.b', fallback: 'B', context: {relative: ['enum', 'b']}, schema: {type: 'string', enum: ['a', 'b']}},
                ],
            },
        },
        {
            name: 'simple numeric enum',
            storeKeys: List(['field']),
            schema: {
                type: 'number',
                enum: [1, 2, 10],
            },
            expected: {
                enumValues: [1, 2, 10],
                valueSchemas: [
                    // @ts-ignore
                    {value: 1, text: 'widget.field.enum.1', fallback: '1', context: {relative: ['enum', 1]}, schema: {type: 'number', enum: [1, 2, 10]}},
                    // @ts-ignore
                    {value: 2, text: 'widget.field.enum.2', fallback: '2', context: {relative: ['enum', 2]}, schema: {type: 'number', enum: [1, 2, 10]}},
                    // @ts-ignore
                    {value: 10, text: 'widget.field.enum.10', fallback: '10', context: {relative: ['enum', 10]}, schema: {type: 'number', enum: [1, 2, 10]}},
                ],
            },
        },
        {
            name: 'enum with ttEnum for beautification',
            storeKeys: List(['field']),
            schema: {
                type: 'string',
                enum: ['option_a', 'option_b'],
                ttEnum: 'upper',
            },
            expected: {
                enumValues: ['option_a', 'option_b'],
                valueSchemas: [
                    // @ts-ignore
                    {value: 'option_a', text: 'widget.field.enum.option_a', fallback: 'OPTION_A', context: {relative: ['enum', 'option_a']}, schema: {type: 'string', enum: ['option_a', 'option_b'], ttEnum: 'upper'}},
                    // @ts-ignore
                    {value: 'option_b', text: 'widget.field.enum.option_b', fallback: 'OPTION_B', context: {relative: ['enum', 'option_b']}, schema: {type: 'string', enum: ['option_a', 'option_b'], ttEnum: 'upper'}},
                ],
            },
        },
        {
            name: 'simple oneOf with const and title',
            storeKeys: List(['field']),
            schema: {
                type: 'string',
                oneOf: [
                    {const: 'a', title: 'Option A'},
                    {const: 'b', title: 'Option B'},
                ],
            },
            expected: {
                enumValues: ['a', 'b'],
                valueSchemas: [
                    // @ts-ignore
                    {value: 'a', text: 'Option A', fallback: 'Option A', context: {relative: ['title']}, schema: {const: 'a', title: 'Option A'}},
                    // @ts-ignore
                    {value: 'b', text: 'Option B', fallback: 'Option B', context: {relative: ['title']}, schema: {const: 'b', title: 'Option B'}},
                ],
            },
        },
        {
            name: 'simple anyOf with const and title',
            storeKeys: List(['field']),
            schema: {
                type: 'string',
                anyOf: [
                    {const: 'a', title: 'Option A'},
                    {const: 'b', title: 'Option B'},
                ],
            },
            expected: {
                enumValues: ['a', 'b'],
                valueSchemas: [
                    // @ts-ignore
                    {value: 'a', text: 'Option A', fallback: 'Option A', context: {relative: ['title']}, schema: {const: 'a', title: 'Option A'}},
                    // @ts-ignore
                    {value: 'b', text: 'Option B', fallback: 'Option B', context: {relative: ['title']}, schema: {const: 'b', title: 'Option B'}},
                ],
            },
        },
        // {
        //     name: 'simple allOf merging to a single option',
        //     storeKeys: List(['field']),
        //     schema: {
        //         type: 'string',
        //         allOf: [
        //             {const: 'a'},
        //             {title: 'Option A'},
        //         ],
        //     },
        //     expected: {
        //         enumValues: ['a'],
        //         valueSchemas: [
        //             // @ts-ignore
        //             {value: 'a', text: 'Option A', fallback: 'Option A', context: {relative: ['title']}, schema: {const: 'a', title: 'Option A'}},
        //         ],
        //     },
        // },
        {
            name: 'oneOf with parent context for beautification',
            storeKeys: List(['field']),
            schema: {
                ttEnum: 'upper',
                oneOf: [
                    {const: 'val-a'},
                    {const: 'val-b', title: 'Value B'},
                    {const: 'val-c', tt: true},// overwrite ttEnum from parent
                ],
            },
            expected: {
                enumValues: ['val-a', 'val-b', 'val-c'],
                valueSchemas: [
                    // @ts-ignore
                    {value: 'val-a', text: 'val-a', fallback: 'VAL-A', context: {relative: ['title']}, schema: {const: 'val-a'}},
                    // @ts-ignore
                    {value: 'val-b', text: 'Value B', fallback: 'Value B', context: {relative: ['title']}, schema: {const: 'val-b', title: 'Value B'}},
                    // @ts-ignore
                    {value: 'val-c', text: 'val-c', fallback: 'Val C', context: {relative: ['title']}, schema: {const: 'val-c', tt: true}},
                ],
            },
        },
        {
            name: 'oneOf with duplicate const values (deduplicates)',
            storeKeys: List(['field']),
            schema: {
                oneOf: [
                    {const: 'a', title: 'First A'},
                    {const: 'b', title: 'Option B'},
                    {const: 'a', title: 'Second A'},
                ],
            },
            expected: {
                enumValues: ['a', 'b'],
                valueSchemas: [
                    // @ts-ignore
                    {value: 'a', text: 'First A', fallback: 'First A', context: {relative: ['title']}, schema: {const: 'a', title: 'First A'}},
                    // @ts-ignore
                    {value: 'b', text: 'Option B', fallback: 'Option B', context: {relative: ['title']}, schema: {const: 'b', title: 'Option B'}},
                ],
            },
        },
        {
            name: 'nested oneOf',
            storeKeys: List(['field']),
            schema: {
                type: 'string',
                oneOf: [
                    {const: 'a', title: 'A'},
                    {
                        oneOf: [
                            {const: 'b', title: 'B'},
                            {const: 'c', title: 'C'},
                        ],
                    },
                ],
            },
            expected: {
                enumValues: ['a', 'b', 'c'],
                valueSchemas: [
                    // @ts-ignore
                    {value: 'a', text: 'A', fallback: 'A', context: {relative: ['title']}, schema: {const: 'a', title: 'A'}},
                    // @ts-ignore
                    {value: 'b', text: 'B', fallback: 'B', context: {relative: ['title']}, schema: {const: 'b', title: 'B'}},
                    // @ts-ignore
                    {value: 'c', text: 'C', fallback: 'C', context: {relative: ['title']}, schema: {const: 'c', title: 'C'}},
                ],
            },
        },
        // {
        //     name: 'allOf containing oneOf',
        //     storeKeys: List(['field']),
        //     schema: {
        //         allOf: [
        //             {type: 'string'},
        //             {
        //                 oneOf: [
        //                     {const: 'a', title: 'A'},
        //                     {const: 'b', title: 'B'},
        //                 ],
        //             },
        //         ],
        //     },
        //     expected: {
        //         enumValues: ['a', 'b'],
        //         valueSchemas: [
        //             // @ts-ignore
        //             {value: 'a', text: 'A', fallback: 'A', context: {relative: ['title']}, schema: {const: 'a', title: 'A'}},
        //             // @ts-ignore
        //             {value: 'b', text: 'B', fallback: 'B', context: {relative: ['title']}, schema: {const: 'b', title: 'B'}},
        //         ],
        //     },
        // },
        // {
        //     name: 'oneOf containing allOf',
        //     storeKeys: List(['field']),
        //     schema: {
        //         type: 'string',
        //         oneOf: [
        //             {allOf: [{const: 'a'}, {title: 'A'}]},
        //             {allOf: [{const: 'b'}, {title: 'B'}]},
        //         ],
        //     },
        //     expected: {
        //         enumValues: ['a', 'b'],
        //         valueSchemas: [
        //             // @ts-ignore
        //             {value: 'a', text: 'A', fallback: 'A', context: {relative: ['title']}, schema: {const: 'a', title: 'A'}},
        //             // @ts-ignore
        //             {value: 'b', text: 'B', fallback: 'B', context: {relative: ['title']}, schema: {const: 'b', title: 'B'}},
        //         ],
        //     },
        // },
        {
            name: 'complex nested applicators',
            storeKeys: List(['field']),
            schema: {
                // allOf: [
                //     {type: 'string'},
                //     {
                anyOf: [
                    {
                        oneOf: [
                            {const: 'a', title: 'A'},
                            {const: 'b', title: 'B'},
                        ],
                    },
                    {const: 'c', title: 'C'},
                ],
                //     },
                // ],
            },
            expected: {
                enumValues: ['a', 'b', 'c'],
                valueSchemas: [
                    // @ts-ignore
                    {value: 'a', text: 'A', fallback: 'A', context: {relative: ['title']}, schema: {const: 'a', title: 'A'}},
                    // @ts-ignore
                    {value: 'b', text: 'B', fallback: 'B', context: {relative: ['title']}, schema: {const: 'b', title: 'B'}},
                    // @ts-ignore
                    {value: 'c', text: 'C', fallback: 'C', context: {relative: ['title']}, schema: {const: 'c', title: 'C'}},
                ],
            },
        },
        {
            name: 'empty oneOf applicator',
            storeKeys: List(['field']),
            schema: {
                type: 'string',
                oneOf: [],
            },
            expected: {
                enumValues: undefined,
                valueSchemas: undefined,
            },
        },
        {
            name: 'oneOf with non-const schemas',
            storeKeys: List(['field']),
            schema: {
                oneOf: [
                    {type: 'string'},
                    {type: 'number'},
                ],
            },
            expected: {
                enumValues: undefined,
                valueSchemas: undefined,
            },
        },
    ]

    test.each(testCases)(
        '$# getOptionsFromSchema : $name',
        async ({storeKeys, expected, ...params}) => {
            let schema
            if ('schema' in params) {
                schema = createOrdered(params.schema)
            } else {
                schema = createOrdered(await readSchema(params.file))
            }

            const options = getOptionsFromSchema(
                storeKeys, schema,
            )

            expect(options.enumValues?.toJS()).toStrictEqual(expected.enumValues)
            expect(options.valueSchemas?.toJS()).toStrictEqual(expected.valueSchemas)
        },
    )
})
