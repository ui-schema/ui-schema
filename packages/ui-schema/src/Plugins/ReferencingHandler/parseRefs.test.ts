import { expect, describe } from '@jest/globals'
import { List, OrderedMap, Map } from 'immutable'
import { ParseRefsContent, StoreSchemaType } from '@ui-schema/ui-schema'
import { parseRefs } from './parseRefs'
import { createMap, createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap/createMap'

const mockDefinitions = createOrderedMap({
    country: {type: 'string', enum: ['fr', 'de', 'it']},
    germany_anchor: {type: 'string', const: 'de', '$anchor': 'germany_anchor'},
    germany_id: {type: 'string', const: 'de', '$id': '#germany_id'},
    germany_id_old: {type: 'string', const: 'de', 'id': '#germany_id_old'},
    address: {
        type: 'object',
        properties: {
            state: {type: 'string'},
            country: {$ref: '#/$defs/country'},
        },
    },
    person: {
        type: 'object',
        properties: {
            name: {type: 'string'},
            children: {
                type: 'array',
                widget: 'GenericList',
                items: {$ref: '#/definitions/person'},
                'default': [],
            },
        },
    },
}) as OrderedMap<string, any>

describe('parseRefs', () => {
    test.each([
        [
            OrderedMap({'type': 'string'}) as StoreSchemaType,
            {defs: OrderedMap()},
            OrderedMap({'type': 'string'}) as StoreSchemaType,
        ], [
            OrderedMap({'$ref': '#/$defs/country'}) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('country')})},
            mockDefinitions.get('country') as StoreSchemaType,
        ], [
            OrderedMap({'$ref': '#/$defs/country'}) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('country')})},
            mockDefinitions.get('country') as StoreSchemaType,
        ], [
            OrderedMap({if: OrderedMap({'$ref': '#germany_id'})}) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('germany_id')})},
            OrderedMap({if: mockDefinitions.get('germany_id')}) as StoreSchemaType,
        ], [
            OrderedMap({then: OrderedMap({'$ref': '#/$defs/country'})}) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('country')})},
            OrderedMap({then: mockDefinitions.get('country')}) as StoreSchemaType,
        ], [
            OrderedMap({else: OrderedMap({'$ref': '#/$defs/country'})}) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('country')})},
            OrderedMap({else: mockDefinitions.get('country')}) as StoreSchemaType,
        ], [
            OrderedMap({not: OrderedMap({'$ref': '#/$defs/country'})}) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('country')})},
            OrderedMap({not: mockDefinitions.get('country')}) as StoreSchemaType,
        ], [
            /*
             * if must be resolve recursively
             */
            OrderedMap({
                if: OrderedMap({
                    not: OrderedMap({'$ref': '#germany_id'}),
                }),
            }) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('germany_id')})},
            OrderedMap({if: OrderedMap({not: mockDefinitions.get('germany_id')})}) as StoreSchemaType,
        ], [
            /*
             * contains must be resolve recursively
             */
            OrderedMap({
                contains: OrderedMap({
                    type: 'object',
                    properties: OrderedMap({
                        germany: OrderedMap({'$ref': '#germany_id'}),
                    }),
                }),
            }) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('germany_id')})},
            OrderedMap({
                contains: OrderedMap({
                    type: 'object',
                    properties: OrderedMap({
                        germany: mockDefinitions.get('germany_id'),
                    }),
                }),
            }) as StoreSchemaType,
        ], [
            /*
             * properties must not be resolve
             */
            OrderedMap({
                type: 'object',
                properties: OrderedMap({
                    germany: OrderedMap({'$ref': '#germany_id'}),
                }),
            }) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('germany_id')})},
            OrderedMap({
                type: 'object',
                properties: OrderedMap({
                    germany: OrderedMap({'$ref': '#germany_id'}),
                }),
            }) as StoreSchemaType,
        ], [
            /*
             * items must not be resolve
             */
            OrderedMap({
                type: 'array',
                items: OrderedMap({'$ref': '#germany_id'}),
            }) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('germany_id')})},
            OrderedMap({
                type: 'array',
                items: OrderedMap({'$ref': '#germany_id'}),
            }) as StoreSchemaType,
        ], [
            /*
             * property names must be resolved, as only `pattern` should be in use, recursive doesn't matter (but is enabled)
             */
            OrderedMap({propertyNames: OrderedMap({'$ref': '#/$defs/country'})}) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('country')})},
            OrderedMap({propertyNames: mockDefinitions.get('country')}) as StoreSchemaType,
        ], [
            /*
             * empty fragment test, must resolve to root
             */
            OrderedMap({'$ref': '#'}) as StoreSchemaType,
            {
                root: createOrderedMap({type: 'object', properties: {user_id: {type: 'number'}, sub_user: {'$ref': '#'}}}),
            },
            createOrderedMap({type: 'object', properties: {user_id: {type: 'number'}, sub_user: {'$ref': '#'}}}) as StoreSchemaType,
        ], [
            /*
             * dependencies must be resolved, recursively
             */
            OrderedMap({
                type: 'object',
                dependencies: OrderedMap({
                    country: OrderedMap({'$ref': '#/$defs/country'}),
                    address: mockDefinitions.get('address'),
                }),
            }) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('country')})},
            OrderedMap({
                type: 'object',
                dependencies: OrderedMap({
                    country: mockDefinitions.get('country'),
                    address: OrderedMap({
                        type: 'object',
                        properties: OrderedMap({
                            state: OrderedMap({type: 'string'}),
                            country: mockDefinitions.get('country'),
                        }),
                    }),
                }),
            }) as StoreSchemaType,
        ], [
            /*
             * dependentSchemas must be resolved, recursively
             */
            OrderedMap({
                type: 'object',
                dependentSchemas: OrderedMap({
                    country: OrderedMap({'$ref': '#/$defs/country'}),
                    address: mockDefinitions.get('address'),
                }),
            }) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('country')})},
            OrderedMap({
                type: 'object',
                dependentSchemas: OrderedMap({
                    country: mockDefinitions.get('country'),
                    address: OrderedMap({
                        type: 'object',
                        properties: OrderedMap({
                            state: OrderedMap({type: 'string'}),
                            country: mockDefinitions.get('country'),
                        }),
                    }),
                }),
            }) as StoreSchemaType,
        ], [
            /*
             * patternProperties names must be resolved recursively
             */
            OrderedMap({
                patternProperties: OrderedMap({
                    '^s_': OrderedMap({'$ref': '#/$defs/country'}),
                }),
            }) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('country')})},
            OrderedMap({
                patternProperties: OrderedMap({
                    '^s_': mockDefinitions.get('country'),
                }),
            }) as StoreSchemaType,
        ], [
            /*
             * allOf names must be resolved
             */
            OrderedMap({
                allOf: List([
                    OrderedMap({'$ref': '#/$defs/country'}),
                ]),
            }) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('country')})},
            OrderedMap({
                allOf: List([
                    mockDefinitions.get('country'),
                ]),
            }) as StoreSchemaType,
        ], [
            /*
             * oneOf names must be resolved
             */
            OrderedMap({
                oneOf: List([
                    OrderedMap({'$ref': '#/$defs/country'}),
                ]),
            }) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('country')})},
            OrderedMap({
                oneOf: List([
                    mockDefinitions.get('country'),
                ]),
            }) as StoreSchemaType,
        ], [
            /*
             * anyOf names must be resolved
             */
            OrderedMap({
                anyOf: List([
                    OrderedMap({'$ref': '#/$defs/country'}),
                ]),
            }) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('country')})},
            OrderedMap({
                anyOf: List([
                    mockDefinitions.get('country'),
                ]),
            }) as StoreSchemaType,
        ], [
            /*
             * testing general JSON pointer with `allOf`
             */
            OrderedMap({
                allOf: List([
                    OrderedMap({'$ref': '#/properties/user_id'}),
                ]),
            }) as StoreSchemaType,
            {
                defs: OrderedMap({country: mockDefinitions.get('country')}),
                root: createOrderedMap({
                    type: 'object',
                    properties: {
                        address: {
                            type: 'object',
                            allOf: [
                                {'$ref': '#/properties/user_id'},
                            ],
                        },
                        user_id: {
                            type: 'number',
                        },
                    },
                }),
            },
            OrderedMap({
                allOf: List([
                    OrderedMap({type: 'number'}),
                ]),
            }) as StoreSchemaType,
        ], /* [
            /*
             * testing general JSON pointer with `allOf`, re-supplying $id when existing
             *
            OrderedMap({
                allOf: List([
                    OrderedMap({'$ref': '#/properties/user_id'}),
                ]),
            }) as StoreSchemaType,
            {
                defs: OrderedMap({country: mockDefinitions.get('country')}),
                root: createOrderedMap({
                    type: 'object',
                    properties: {
                        address: {
                            type: 'object',
                            allOf: [
                                {'$ref': '#/properties/user_id'},
                            ],
                        },
                        user_id: {
                            type: 'number',
                        },
                    },
                }),
            },
            OrderedMap({
                allOf: List([
                    OrderedMap({type: 'number'}),
                ]),
            }) as StoreSchemaType,
        ],*/ [
            /*
             * tests for non-recursives, if they are inside `if` and must resolve recursive
             */
            createOrderedMap({
                if: {items: {'$ref': '#/$defs/country'}},
            }) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('country')})},
            OrderedMap({
                if: OrderedMap({items: mockDefinitions.get('country')}),
            }) as StoreSchemaType,
        ], [
            /*
             * tests for non-recursives, if they are inside `if` and must resolve recursive
             */
            createOrderedMap({
                if: {items: [{'$ref': '#/$defs/country'}, {'$ref': '#/$defs/country'}]},
            }) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('country')})},
            createOrderedMap({
                if: {items: [mockDefinitions.get('country').toJS(), mockDefinitions.get('country').toJS()]},
            }) as StoreSchemaType,
        ], [
            /*
             * tests for non-recursives, if they are inside `if` and must resolve recursive
             */
            createOrderedMap({
                if: {properties: {country: {'$ref': '#/$defs/country'}}},
            }) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('country')})},
            createOrderedMap({
                if: {properties: {country: mockDefinitions.get('country').toJS()}},
            }) as StoreSchemaType,
        ], [
            /*
             * tests for nested root schema
             */
            createOrderedMap({
                if: {
                    properties: {
                        location: {
                            $id: 'https://localhost',
                            type: 'object',
                            $defs: {
                                country: {type: 'string', enum: ['fr', 'de', 'it', 'es']},
                            },
                            properties: {
                                // this $ref needs to use the $defs of this level
                                country: {'$ref': '#/$defs/country'},
                            },
                        },
                        // this $ref needs to use the $defs of the known root-schema
                        country: {'$ref': '#/$defs/country'},
                    },
                },
            }) as StoreSchemaType,
            {defs: OrderedMap({country: mockDefinitions.get('country')})},
            createOrderedMap({
                if: {
                    properties: {
                        location: {
                            $id: 'https://localhost',
                            type: 'object',
                            $defs: {
                                country: {type: 'string', enum: ['fr', 'de', 'it', 'es']},
                            },
                            properties: {
                                country: {type: 'string', enum: ['fr', 'de', 'it', 'es']},
                            },
                        },
                        country: mockDefinitions.get('country').toJS(),
                    },
                },
            }) as StoreSchemaType,
        ],
    ] as [
        StoreSchemaType,
        ParseRefsContent,
        StoreSchemaType,
    ][])(
        'parseRefs(%j, %j): %j',
        (schema, context, expectedSchema) => {
            const res = parseRefs(schema, context)
            const r = res.schema.equals(expectedSchema)
            if (!r) {
                console.error(res.schema.toJS(), expectedSchema.toJS())
            }
            expect(r).toBe(true)
        }
    )

    test.each([
        [
            createOrderedMap({
                if: {
                    properties: {
                        location: {
                            $id: 'https://localhost:8080/root-2.json',
                            type: 'object',
                            properties: {
                                // this $ref needs to use the $id of this level
                                country: {'$ref': 'dummy-1a.json'},
                            },
                        },
                        // this $ref needs to use the $defs of the known root-schema
                        country: {'$ref': 'https://localhost:3000/dummy-2.json'},
                        state: {'$ref': 'dummy-3.json'},
                    },
                },
            }) as StoreSchemaType,
            {},
            createMap({
                'https://localhost:8080/root-2.json': {
                    'dummy-1a.json': ['*'],
                },
                '#': {
                    'https://localhost:3000/dummy-2.json': ['*'],
                    'dummy-3.json': ['*'],
                },
            }) as unknown as Map<string, Map<string, any>>,
        ], [
            createOrderedMap({
                if: {
                    properties: {
                        location: {
                            $id: 'https://localhost:8080/root-2.json',
                            type: 'object',
                            properties: {
                                // this $ref needs to use the $id of this level
                                country: {'$ref': 'dummy-1a.json'},
                            },
                        },
                        // this $ref needs to use the $defs of the known root-schema
                        country: {'$ref': 'https://localhost:3000/dummy-2.json'},
                        state: {'$ref': 'dummy-3.json'},
                    },
                },
            }) as StoreSchemaType,
            {fetchSchema: (ref) => ref === 'dummy-3.json' ? Map() : undefined},
            createMap({
                'https://localhost:8080/root-2.json': {
                    'dummy-1a.json': ['*'],
                },
                '#': {
                    'https://localhost:3000/dummy-2.json': ['*'],
                },
            }) as unknown as Map<string, Map<string, any>>,
        ],
    ] as [
        StoreSchemaType,
        ParseRefsContent,
        Map<string, Map<string, any>>,
    ][])(
        'pending: parseRefs(%j, %j): %j',
        (schema, context, expectedPending) => {
            const res = parseRefs(schema, context)
            const r = res.pending.equals(expectedPending)
            if (!r) {
                if (process.env.NODE_ENV === 'development') {
                    console.error(res.pending.toJS(), expectedPending.toJS())
                }
            }
            expect(r).toBe(true)
        }
    )
})
