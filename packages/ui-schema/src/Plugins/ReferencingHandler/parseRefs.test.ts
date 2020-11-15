import { expect, describe } from '@jest/globals'
import { List, OrderedMap } from 'immutable'
import { StoreSchemaType } from '@ui-schema/ui-schema'
import { parseRefs } from './parseRefs'
import { createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap/createMap'

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
             * dependencies must be resolved, recursively, todo: really recursively
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
             * dependentSchemas must be resolved, recursively, todo: really recursively
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
                schema: createOrderedMap({
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
                schema: createOrderedMap({
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
        ],*/
        // todo: tests for non-recursives, if they are inside `if` and must resolve recursive
    ] as [
        StoreSchemaType, {
            defs: OrderedMap<string, any>
        },
        StoreSchemaType
    ][])(
        'parseRefs(%j, %j): %j',
        (schema, context, expectedSchema) => {
            const res = parseRefs(schema, context)
            const r = res.schema.equals(expectedSchema)
            if (!r) {
                console.error(res.schema.toJS())
            }
            expect(r).toBe(true)
        }
    )
})
