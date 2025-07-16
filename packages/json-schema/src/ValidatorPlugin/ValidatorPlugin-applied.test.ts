import { describe, expect, test } from '@jest/globals'
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { makeParams, Validator } from '@ui-schema/json-schema/Validator'
import { mergeSchemas, validatorPlugin } from '@ui-schema/json-schema/ValidatorPlugin'
import { createOrdered } from '@ui-schema/ui-schema/createMap'
import { resourceFromSchema } from '@ui-schema/ui-schema/SchemaResource'
import { List } from 'immutable'
import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'

/**
 * npm run tdd -- --testPathPattern=ValidatorPlugin/ValidatorPlugin-applied.test.ts --selectProjects=test-@ui-schema/json-schema
 */

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const mocksFolder = path.join(__dirname, '../../', 'tests/mocks')

const readSchema = (filename: string) => {
    return fs.readFile(path.join(mocksFolder, filename)).then(b => JSON.parse(b.toString()))
}

describe('ValidatorPlugin-applied', () => {
    const validator = Validator(standardValidators)
    const testCases: (({ schema: any } | { file: string }) & { name: string, value: unknown, applied: any, expectedValid?: boolean, merged: any })[] = [
        {
            name: 'ref chains resolving, incl. extending',
            schema: {
                $defs: {
                    string: {
                        type: 'string',
                    },
                    email: {
                        $ref: '#/$defs/string',
                        title: 'E-Mail',
                    },
                },
                $ref: '#/$defs/email',
                format: 'email',
            },
            value: '',
            applied: [
                // TBD: "base schema" is not in `applied` (atm.?)
                // {
                //     // $ref: '#/$defs/email',
                //     format: 'email',
                // },
                {
                    // TBD: $ref may be removed here in the future
                    $ref: '#/$defs/string',
                    title: 'E-Mail',
                },
                {
                    type: 'string',
                },
            ],
            merged: {
                $defs: {
                    email: {
                        $ref: '#/$defs/string',
                        title: 'E-Mail',
                    },
                    string: {
                        type: 'string',
                    },
                },

                // TBD: $ref may be removed here in the future
                $ref: '#/$defs/email',
                format: 'email',
                title: 'E-Mail',
                type: 'string',
            },
        },
        {
            name: 'multiple object properties in allOf branches',
            schema: {
                type: 'object',
                allOf: [
                    {
                        properties: {
                            'name': {
                                type: 'string',
                            },
                        },
                    },
                    {
                        properties: {
                            'name': {
                                minLength: 5,
                            },
                            'age': {
                                type: 'number',
                            },
                        },
                    },
                ],
            },
            value: {
                name: 'lorem ipsum',
                age: 33,
            },
            applied: [
                {
                    properties: {
                        name: {
                            type: 'string',
                        },
                    },
                },
                {
                    properties: {
                        name: {
                            minLength: 5,
                        },
                        age: {
                            type: 'number',
                        },
                    },
                },
            ],
            merged: {
                type: 'object',
                // TBD: `allOf` are in `applied` and merged for this level, they may be cleaned up later
                // allOf: [
                //     {
                //         properties: {
                //             'name': {
                //                 type: 'string',
                //             },
                //         },
                //     },
                //     {
                //         properties: {
                //             'name': {
                //                 minLength: 5,
                //             },
                //             'age': {
                //                 type: 'number',
                //             },
                //         },
                //     },
                // ],
                properties: {
                    name: {
                        type: 'string',
                        // for `allOf`, properties which exist in different branche, are merged in a new `allOf` on property level, with the first existing property-schema as the base
                        allOf: [
                            {minLength: 5},
                        ],
                    },
                    age: {
                        type: 'number',
                    },
                },
            },
        },
        {
            name: 'allOf with if/then/else',
            schema: {
                type: 'object',
                properties: {
                    'name': {
                        type: 'string',
                    },
                },
                allOf: [
                    {
                        if: {
                            properties: {
                                name: {
                                    minLength: 5,
                                },
                            },
                        },
                        then: {
                            properties: {
                                name: {
                                    maxLength: 10,
                                },
                            },
                        },
                        else: {
                            properties: {
                                name: {
                                    pattern: '^[A-Z]+$',
                                },
                            },
                        },
                    },
                ],
            },
            value: {
                name: 'LOREM IPSUM',
            },
            applied: [
                {
                    if: {
                        properties: {
                            name: {
                                minLength: 5,
                            },
                        },
                    },
                    then: {
                        properties: {
                            name: {
                                maxLength: 10,
                            },
                        },
                    },
                    else: {
                        properties: {
                            name: {
                                pattern: '^[A-Z]+$',
                            },
                        },
                    },
                },
                {
                    properties: {
                        name: {
                            maxLength: 10,
                        },
                    },
                } as any,
            ],
            merged: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        allOf: [
                            {
                                maxLength: 10,
                            },
                        ],
                    },
                },
                // TBD: `allOf` are in `applied` and merged for this level, they may be cleaned up later
                // allOf: [
                //     {
                //         if: {
                //             properties: {
                //                 name: {
                //                     minLength: 5,
                //                 },
                //             },
                //         },
                //         then: {
                //             properties: {
                //                 name: {
                //                     maxLength: 10,
                //                 },
                //             },
                //         },
                //         else: {
                //             properties: {
                //                 name: {
                //                     pattern: '^[A-Z]+$',
                //                 },
                //             },
                //         },
                //     },
                // ],
                // TBD: `jf/then/else` are in `applied` and merged for this level, they may be cleaned up later
                // if: {
                //     properties: {
                //         name: {
                //             minLength: 5,
                //         },
                //     },
                // },
                // then: {
                //     properties: {
                //         name: {
                //             maxLength: 10,
                //         },
                //     },
                // },
                // else: {
                //     properties: {
                //         name: {
                //             pattern: '^[A-Z]+$',
                //         },
                //     },
                // },
            },
        },
        {
            name: 'Object: merge `required` keyword (overwrite)',
            schema: {
                type: 'object',
                properties: {
                    prop1: {type: 'string'},
                    prop2: {type: 'string'},
                    prop3: {type: 'string'},
                },
                allOf: [
                    {required: ['prop1']},
                    {required: ['prop2', 'prop3']},
                ],
            },
            value: {prop1: 'a', prop2: 'b', prop3: 'c'},
            applied: [
                {required: ['prop1']},
                {required: ['prop2', 'prop3']},
            ],
            merged: {
                type: 'object',
                properties: {
                    prop1: {type: 'string'},
                    prop2: {type: 'string'},
                    prop3: {type: 'string'},
                },
                // allOf: [
                //     {required: ['prop1']},
                //     {required: ['prop2', 'prop3']},
                // ],
                required: ['prop1', 'prop2', 'prop3'],
            },
        },
        {
            name: 'Object: merge `patternProperties`',
            schema: {
                type: 'object',
                allOf: [
                    {patternProperties: {'^S_': {type: 'string'}}},
                    {patternProperties: {'^N_': {type: 'number'}}},
                ],
            },
            value: {S_user: 'admin', N_id: 1},
            applied: [
                {patternProperties: {'^S_': {type: 'string'}}},
                {patternProperties: {'^N_': {type: 'number'}}},
            ],
            merged: {
                type: 'object',
                // allOf: [
                //     {patternProperties: {'^S_': {type: 'string'}}},
                //     {patternProperties: {'^N_': {type: 'number'}}},
                // ],
                patternProperties: {
                    '^S_': {type: 'string'},
                    '^N_': {type: 'number'},
                },
            },
        },
        {
            name: 'Object: merge conflicting `patternProperties`',
            schema: {
                type: 'object',
                allOf: [
                    {patternProperties: {'^S_': {type: 'string'}}},
                    {patternProperties: {'^S_': {minLength: 5}}},
                ],
            },
            value: {S_user: 'admin'},
            applied: [
                {patternProperties: {'^S_': {type: 'string'}}},
                {patternProperties: {'^S_': {minLength: 5}}},
            ],
            merged: {
                type: 'object',
                // allOf: [
                //     {patternProperties: {'^S_': {type: 'string'}}},
                //     {patternProperties: {'^S_': {minLength: 5}}},
                // ],
                patternProperties: {
                    '^S_': {
                        type: 'string',
                        allOf: [{minLength: 5}],
                    },
                },
            },
        },
        {
            name: 'Object: merge conflicting `additionalProperties`',
            schema: {
                type: 'object',
                allOf: [
                    {additionalProperties: false},
                    {additionalProperties: {type: 'string'}},
                ],
            },
            value: {prop1: 'test'},
            applied: [
                {additionalProperties: false},
                {additionalProperties: {type: 'string'}},
            ],
            merged: {
                type: 'object',
                // allOf: [
                //     {additionalProperties: false},
                //     {additionalProperties: {type: 'string'}},
                // ],
                additionalProperties: false, // false wins
            },
        },
        {
            name: 'Object: merge `additionalProperties` with schema',
            schema: {
                type: 'object',
                additionalProperties: {type: 'number'},
                allOf: [
                    {additionalProperties: {minimum: 0}},
                ],
            },
            value: {prop1: 10},
            applied: [
                {additionalProperties: {minimum: 0}},
            ],
            merged: {
                type: 'object',
                // allOf: [
                //     {additionalProperties: {minimum: 0}},
                // ],
                additionalProperties: {
                    // todo: improve, only nest if base exists
                    allOf: [
                        {type: 'number'},
                        {minimum: 0},
                    ],
                },
            },
        },
        {
            name: 'Array: merge `items` schema from two allOf branches',
            schema: {
                type: 'array',
                allOf: [
                    {items: {type: 'string'}},
                    {items: {minLength: 2}},
                ],
            },
            value: ['ab', 'cd'],
            applied: [
                {items: {type: 'string'}},
                {items: {minLength: 2}},
            ],
            merged: {
                type: 'array',
                // allOf: [
                //     {items: {type: 'string'}},
                //     {items: {minLength: 2}},
                // ],
                items: {
                    allOf: [
                        {type: 'string'},
                        {minLength: 2},
                    ],
                },
            },
        },
        {
            name: 'Array: merge `minItems` and `maxItems`',
            schema: {
                type: 'array',
                allOf: [
                    {minItems: 1},
                    {maxItems: 2},
                ],
            },
            value: ['a', 'b'],
            applied: [
                {minItems: 1},
                {maxItems: 2},
            ],
            merged: {
                type: 'array',
                // allOf: [
                //     {minItems: 1},
                //     {maxItems: 2},
                // ],
                minItems: 1,
                maxItems: 2,
            },
        },
        // // {
        // //     name: 'Array: merge `prefixItems` (overwrite)',
        // //     schema: {
        // //         type: 'array',
        // //         allOf: [
        // //             {prefixItems: [{type: 'string'}]},
        // //             {prefixItems: [{type: 'string'}, {type: 'number'}]},
        // //         ],
        // //     },
        // //     value: ['a', 1],
        // //     applied: [
        // //         {prefixItems: [{type: 'string'}]},
        // //         {prefixItems: [{type: 'string'}, {type: 'number'}]},
        // //     ],
        // //     merged: {
        // //         type: 'array',
        // //         allOf: [
        // //             {prefixItems: [{type: 'string'}]},
        // //             {prefixItems: [{type: 'string'}, {type: 'number'}]},
        // //         ],
        // //         prefixItems: [{type: 'string'}, {type: 'number'}], // last one wins
        // //     },
        // // },
        // {
        //     name: 'Array: merge `prefixItems` and `items`',
        //     schema: {
        //         type: 'array',
        //         allOf: [
        //             {prefixItems: [{type: 'string'}]},
        //             {items: {type: 'boolean'}},
        //         ],
        //     },
        //     value: ['a', true, false],
        //     applied: [
        //         {prefixItems: [{type: 'string'}]},
        //         {items: {type: 'boolean'}},
        //     ],
        //     merged: {
        //         type: 'array',
        //         allOf: [
        //             {prefixItems: [{type: 'string'}]},
        //             {items: {type: 'boolean'}},
        //         ],
        //         prefixItems: [{type: 'string'}],
        //         items: {type: 'boolean'},
        //     },
        // },
        {
            name: 'Array: merge `uniqueItems`',
            schema: {
                type: 'array',
                allOf: [
                    {items: {type: 'number'}},
                    {uniqueItems: true},
                ],
            },
            value: [1, 2, 3],
            applied: [
                {items: {type: 'number'}},
                {uniqueItems: true},
            ],
            merged: {
                type: 'array',
                // allOf: [
                //     {items: {type: 'number'}},
                //     {uniqueItems: true},
                // ],
                items: {type: 'number'},
                uniqueItems: true,
            },
        },
        {
            name: 'Enum: merge conflicting enums (overwrite)',
            schema: {
                type: 'string',
                allOf: [
                    {enum: ['a', 'b', 'c']},
                    {enum: ['c', 'd', 'e']},
                ],
            },
            value: 'd',
            applied: [
                {enum: ['a', 'b', 'c']},
                {enum: ['c', 'd', 'e']},
            ],
            merged: {
                type: 'string',
                // allOf: [
                //     {enum: ['a', 'b', 'c']},
                //     {enum: ['c', 'd', 'e']},
                // ],
                enum: ['c'],
            },
            expectedValid: false,
        },
        {
            name: 'Const merge conflicting `const`',
            schema: {
                type: 'string',
                allOf: [
                    {const: 'a'},
                    {const: 'b'},
                ],
            },
            value: 'a',
            applied: [
                {const: 'a'},
                {const: 'b'},
            ],
            merged: {
                type: 'string',
                allOf: [
                    {const: 'b'},
                ],
                const: 'a',
            },
            expectedValid: false,
        },
        {
            name: 'Const merge compatible `const`, complex',
            // using immutable, complex const are compared deeply, not producing unnecessary branches
            schema: {
                type: 'object',
                allOf: [
                    {const: {id: '_id'}},
                    {const: {id: '_id'}},
                ],
            },
            value: {id: '_id'},
            applied: [
                {const: {id: '_id'}},
                {const: {id: '_id'}},
            ],
            merged: {
                type: 'object',
                // allOf: [
                //     {const: {id: '_id'}},
                //     {const: {id: '_id'}},
                // ],
                const: {id: '_id'},
            },
        },
        {
            name: 'MultipleOf: merge multipleOf keyword',
            schema: {
                type: 'number',
                allOf: [
                    {multipleOf: 2},
                    {multipleOf: 3},
                ],
            },
            value: 6,
            applied: [
                {multipleOf: 2},
                {multipleOf: 3},
            ],
            merged: {
                type: 'number',
                // allOf: [
                //     {multipleOf: 2},
                //     {multipleOf: 3},
                // ],
                multipleOf: 6, // LCM of 2 and 3
            },
        },
        {
            name: 'Numeric: merge `minimum`',
            schema: {
                type: 'number',
                allOf: [
                    {minimum: 5},
                    {minimum: 10},
                ],
            },
            value: 10,
            applied: [
                {minimum: 5},
                {minimum: 10},
            ],
            merged: {
                type: 'number',
                // allOf: [
                //     {minimum: 5},
                //     {minimum: 10},
                // ],
                minimum: 10, // max value wins
            },
        },
        {
            name: 'Numeric: merge `minimum` with invalid value',
            schema: {
                type: 'number',
                minimum: 5,
                allOf: [
                    {minimum: null},
                ],
            },
            value: 10,
            applied: [
                {minimum: null},
            ],
            merged: {
                type: 'number',
                // allOf: [
                //     {minimum: null},
                // ],
                minimum: 5,// no change
            },
        },
        {
            name: 'Numeric: merge `maximum` with invalid value',
            schema: {
                type: 'number',
                maximum: 50,
                allOf: [
                    {maximum: null},
                ],
            },
            value: 10,
            applied: [
                {maximum: null},
            ],
            merged: {
                type: 'number',
                // allOf: [
                //     {maximum: null},
                // ],
                maximum: 50,// no change
            },
        },
        {
            name: 'Numeric: merge `maximum`',
            schema: {
                type: 'number',
                allOf: [
                    {maximum: 10},
                    {maximum: 5},
                ],
            },
            value: 5,
            applied: [
                {maximum: 10},
                {maximum: 5},
            ],
            merged: {
                type: 'number',
                // allOf: [
                //     {maximum: 10},
                //     {maximum: 5},
                // ],
                maximum: 5, // min value wins
            },
        },
        {
            name: 'String: merge `minLength`',
            schema: {
                type: 'string',
                allOf: [
                    {minLength: 5},
                    {minLength: 10},
                ],
            },
            value: '0123456789',
            applied: [
                {minLength: 5},
                {minLength: 10},
            ],
            merged: {
                type: 'string',
                // allOf: [
                //     {minLength: 5},
                //     {minLength: 10},
                // ],
                minLength: 10, // max value wins
            },
        },
        {
            name: 'String: merge `maxLength`',
            schema: {
                type: 'string',
                allOf: [
                    {maxLength: 10},
                    {maxLength: 5},
                ],
            },
            value: '01234',
            applied: [
                {maxLength: 10},
                {maxLength: 5},
            ],
            merged: {
                type: 'string',
                // allOf: [
                //     {maxLength: 10},
                //     {maxLength: 5},
                // ],
                maxLength: 5, // min value wins
            },
        },
        {
            name: 'Merge type keyword on untyped base',
            schema: {
                allOf: [
                    {type: 'array'},
                ],
            },
            value: ['a', 1],
            applied: [
                {type: 'array'},
            ],
            merged: {
                type: 'array',
                // allOf: [
                //     {type: 'array'},
                // ],
            },
        },
        {
            name: 'Merge type keyword on base, single type',
            schema: {
                type: 'array',
                allOf: [
                    {type: 'array'},
                ],
            },
            value: ['a', 1],
            applied: [
                {type: 'array'},
            ],
            merged: {
                type: 'array',
                // allOf: [
                //     {type: 'array'},
                // ],
            },
        },
        {
            name: 'Merge type keyword on base, single + multi--type',
            schema: {
                type: 'array',
                allOf: [
                    {type: ['array', 'null']},
                ],
            },
            value: ['a', 1],
            applied: [
                {type: ['array', 'null']},
            ],
            merged: {
                type: 'array',
                // allOf: [
                //     {type: ['array', 'null']},
                // ],
            },
        },
        {
            name: 'Merge type keyword on base, multi-type',
            schema: {
                type: ['string', 'number'],
                allOf: [
                    {type: ['string', 'number']},
                ],
            },
            value: 'a',
            applied: [
                {type: ['string', 'number']},
            ],
            merged: {
                type: ['string', 'number'],
                // allOf: [
                //     {type: ['string', 'number']},
                // ],
            },
        },
        {
            name: 'Merge incompatible type keyword single-type',
            schema: {
                type: 'string',
                allOf: [
                    {type: 'number'},
                ],
            },
            value: 'a',
            applied: [
                {type: 'number'},
            ],
            merged: {
                type: 'string',
                // allOf: [
                //     {type: 'number'},
                // ],
            },
            expectedValid: false,
        },
        {
            name: 'Merge incompatible type keyword single-type with succeeding',
            // test for logic in a different branch, no real effect visible, only that the skip-if-invalid is tested
            schema: {
                type: 'string',
                allOf: [
                    {type: 'number'}, // first invalid sets flag
                    {type: 'boolean'}, // second type won't be used
                ],
            },
            value: 'a',
            applied: [
                {type: 'number'},
                {type: 'boolean'},
            ],
            merged: {
                type: 'string',
                // allOf: [
                //     {type: 'number'},
                //     {type: 'boolean'},
                // ],
            },
            expectedValid: false,
        },
        {
            name: 'Merge incompatible type keyword (array)',
            schema: {
                type: ['array'],
                allOf: [
                    {type: ['string']},
                ],
            },
            value: 'a',
            applied: [
                {type: ['string']},
            ],
            merged: {
                type: ['array'],
                // allOf: [
                //     {type: ['string']},
                // ],
            },
            expectedValid: false,
        },
        // {
        //     name: 'General: merge `title` and `description`',
        //     schema: {
        //         allOf: [
        //             {title: 'My Title'},
        //             {description: 'My Description'},
        //         ],
        //     },
        //     value: 'any value',
        //     applied: [
        //         {title: 'My Title'},
        //         {description: 'My Description'},
        //     ],
        //     merged: {
        //         allOf: [
        //             {title: 'My Title'},
        //             {description: 'My Description'},
        //         ],
        //         title: 'My Title',
        //         description: 'My Description',
        //     },
        // },
        {
            name: 'General: overwrite `title` from a later allOf branch',
            schema: {
                allOf: [
                    {title: 'Old Title'},
                    {title: 'New Title'},
                ],
            },
            value: 'any value',
            applied: [
                {title: 'Old Title'},
                {title: 'New Title'},
            ],
            merged: {
                // allOf: [
                //     {title: 'Old Title'},
                //     {title: 'New Title'},
                // ],
                title: 'New Title', // last one wins
            },
        },
        {
            name: 'anyOf: merge when base has no anyOf',
            schema: {
                type: 'string',
                allOf: [
                    {
                        anyOf: [
                            {minLength: 5},
                            {const: 'special'},
                        ],
                    },
                ],
            },
            value: 'special',
            applied: [
                {
                    anyOf: [
                        {minLength: 5},
                        {const: 'special'},
                    ],
                },
                {minLength: 5},
            ],
            merged: {
                type: 'string',
                anyOf: [
                    {minLength: 5},
                    {const: 'special'},
                ],
                minLength: 5,
            },
        },
        {
            name: 'anyOf: merge when base has anyOf',
            schema: {
                type: 'string',
                anyOf: [
                    {pattern: '^s'},
                ],
                allOf: [
                    {
                        anyOf: [
                            {minLength: 8},
                            {const: 'special'},
                        ],
                    },
                ],
            },
            value: 'special',
            applied: [
                {
                    anyOf: [
                        {minLength: 8},
                        {const: 'special'},
                    ],
                },
                {const: 'special'},
                {pattern: '^s'},
            ],
            merged: {
                type: 'string',
                anyOf: [
                    {anyOf: [{pattern: '^s'}]},
                    {anyOf: [{minLength: 8}, {const: 'special'}]},
                ],
                'const': 'special',
                pattern: '^s',
            },
        },
        {
            name: 'oneOf: merge when base has no oneOf',
            schema: {
                type: 'number',
                allOf: [
                    {oneOf: [{multipleOf: 2}, {multipleOf: 3}]},
                ],
            },
            value: 4, // Valid for multipleOf: 2, but not 3.
            applied: [
                {oneOf: [{multipleOf: 2}, {multipleOf: 3}]},
            ],
            merged: {
                type: 'number',
                oneOf: [
                    {multipleOf: 2},
                    {multipleOf: 3},
                ],
            },
        },
        {
            name: 'oneOf: merge when base has oneOf',
            schema: {
                type: 'number',
                oneOf: [
                    {maximum: 5},
                ],
                allOf: [
                    {oneOf: [{multipleOf: 2}, {multipleOf: 3}]},
                ],
            },
            value: 4, // Valid for maximum: 5 AND (multipleOf: 2 but not 3)
            applied: [
                {oneOf: [{multipleOf: 2}, {multipleOf: 3}]},
            ],
            merged: {
                type: 'number',
                oneOf: [
                    {oneOf: [{maximum: 5}]},
                    {oneOf: [{multipleOf: 2}, {multipleOf: 3}]},
                ],
            },
        },
        {
            name: 'multipleOf float',
            schema: {
                type: 'number',
                multipleOf: 0.1,
                allOf: [
                    {multipleOf: 0.25},
                    {multipleOf: 0.5},
                ],
            },
            value: 1,
            applied: [
                {multipleOf: 0.25},
                {multipleOf: 0.5},
            ],
            merged: {
                type: 'number',
                multipleOf: 0.5,
            },
        },
        {
            name: 'multipleOf float',
            schema: {
                type: 'number',
                multipleOf: 0.02,
                allOf: [
                    {multipleOf: 0.03},
                    {multipleOf: 0.05},
                ],
            },
            value: 0.3,
            applied: [
                {multipleOf: 0.03},
                {multipleOf: 0.05},
            ],
            merged: {
                type: 'number',
                multipleOf: 0.3,
            },
        },
        {
            name: 'multipleOf float',
            schema: {
                type: 'number',
                multipleOf: 0.2,
                allOf: [
                    {multipleOf: 0.5},
                    {multipleOf: 0.25},
                ],
            },
            value: 2,
            applied: [
                {multipleOf: 0.5},
                {multipleOf: 0.25},
            ],
            merged: {
                type: 'number',
                multipleOf: 1,
            },
        },
    ]

    test.each(testCases)(
        '$# validator.validate : $name',
        async ({value, merged, applied, expectedValid = true, ...params}) => {
            let schema
            if ('schema' in params) {
                schema = createOrdered(params.schema)
            } else {
                schema = createOrdered(await readSchema(params.file))
            }

            const res = validator.validate(
                schema,
                value && typeof value === 'object' ? createOrdered(value) : value,
                {
                    ...makeParams(),
                    resource: resourceFromSchema(schema),
                },
            )
            // console.log('res.applied', res.applied?.map(s => s.toJS()))
            expect(res.valid).toBe(expectedValid)
            expect(res.applied?.map(s => s.toJS())).toStrictEqual(applied)

            const applicableSchema = mergeSchemas(schema, ...res.applied || [])

            // @ts-ignore
            expect(applicableSchema.toJS()).toStrictEqual(merged)
        },
    )

    test.each(testCases)(
        '$# validatorPlugin.handle : $name',
        async ({value, merged, expectedValid = true, ...params}) => {
            let schema
            if ('schema' in params) {
                schema = createOrdered(params.schema)
            } else {
                schema = createOrdered(await readSchema(params.file))
            }

            const pluginProps = validatorPlugin.handle?.({
                // --- schema/value location ---
                schema: schema,
                storeKeys: List([]),
                value: value && typeof value === 'object' ? createOrdered(value) : value,
                // --- adapters ---
                validate: validator.validate,
                resource: resourceFromSchema(schema),
                // --- unused ---
                t: function() {
                    throw new Error('Not implemented.')
                },
                onChange: function(): void {
                    throw new Error('Not implemented.')
                },
                internalValue: undefined,
            })

            expect(pluginProps?.valid).toBe(expectedValid)

            // @ts-ignore
            expect(pluginProps?.schema.toJS()).toStrictEqual(merged)
        },
    )
})
