import { Map } from 'immutable'
import { createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap/createMap'
import { handleIfElseThen } from '@ui-schema/ui-schema/Plugins/ConditionalHandler/handleIfElseThen'
import { StoreSchemaType } from '@ui-schema/ui-schema'

describe('handleIfElseThen', () => {
    test.each([
        [
            createOrderedMap({
                if: {
                    'properties': {
                        'country': {
                            'type': 'string',
                            'const': 'canada',
                        },
                    },
                },
                then: {
                    'properties': {
                        'region': {
                            'type': 'string',
                            'const': 'quebec',
                        },
                    },
                },
                else: {},
            }/* as JsonSchema*/),
            createOrderedMap({
                country: 'canada',
            }),
            createOrderedMap({
                type: 'object',
                properties: {
                    country: {
                        type: 'string',
                    },
                },
            }),// distSchema
            createOrderedMap({
                type: 'object',
                properties: {
                    country: {
                        type: 'string',
                    },
                    'region': {
                        'type': 'string',
                        'const': 'quebec',
                    },
                },
            }),// expectedSchema
            true,// expected
        ],
        [
            createOrderedMap({
                if: {
                    'properties': {
                        'country': {
                            'type': 'string',
                            'const': 'canada',
                        },
                    },
                },
                else: {
                    'properties': {
                        'region': {
                            'type': 'string',
                            'const': 'berlin',
                        },
                    },
                },
            }/* as JsonSchema*/),
            createOrderedMap({
                country: 'germany',
            }),
            createOrderedMap({
                type: 'object',
                properties: {
                    country: {
                        type: 'string',
                    },
                },
            }),// distSchema
            createOrderedMap({
                type: 'object',
                properties: {
                    country: {
                        type: 'string',
                    },
                    'region': {
                        'type': 'string',
                        'const': 'berlin',
                    },
                },
            }),// expectedSchema
            true,// expected
        ],
        [
            createOrderedMap({
                if: {
                    'properties': {
                        'country': {
                            'type': 'string',
                            'const': 'canada',
                        },
                    },
                },
                else: {
                    'properties': {
                        'region': {
                            'type': 'string',
                            'const': 'berlin',
                        },
                    },
                },
            }/* as JsonSchema*/),
            createOrderedMap({
                country: 'canada',
            }),
            createOrderedMap({
                type: 'object',
                properties: {
                    country: {
                        type: 'string',
                    },
                },
            }),// distSchema
            createOrderedMap({
                type: 'object',
                properties: {
                    country: {
                        type: 'string',
                    },
                },
            }),// expectedSchema
            true,// expected
        ],
        [
            createOrderedMap({
                if: {
                    'properties': {
                        'country': {
                            'type': 'string',
                            'const': 'canada',
                        },
                    },
                },
                then: {
                    'properties': {
                        'region': {
                            'type': 'string',
                            'const': 'quebec',
                        },
                    },
                },
            }/* as JsonSchema*/),
            createOrderedMap({
                country: 'canada',
            }),
            createOrderedMap({
                type: 'object',
                properties: {
                    country: {
                        type: 'string',
                    },
                },
            }),// distSchema
            createOrderedMap({
                type: 'object',
                properties: {
                    country: {
                        type: 'string',
                    },
                    region: {
                        type: 'string',
                    },
                },
            }),// expectedSchema
            false,// expected
        ],
        [
            createOrderedMap({}/* as JsonSchema*/),
            createOrderedMap({
                country: 'canada',
            }),
            createOrderedMap({
                type: 'object',
                properties: {
                    country: {
                        type: 'string',
                    },
                },
            }),// distSchema
            createOrderedMap({
                type: 'object',
                properties: {
                    country: {
                        type: 'string',
                    },
                    region: {
                        'type': 'string',
                        'const': 'quebec',
                    },
                },
            }),// expectedSchema
            false,// expected
        ],
        [
            createOrderedMap({
                if: {
                    'properties': {
                        'country': {
                            'type': 'string',
                            'const': 'canada',
                        },
                    },
                },
                then: {
                    'properties': {
                        'region': {
                            'type': 'string',
                            'const': 'quebec',
                        },
                    },
                },
                else: {
                    'properties': {
                        'region': {
                            'type': 'string',
                            'const': 'scottland',
                        },
                    },
                },
            }/* as JsonSchema*/),
            createOrderedMap({
                country: 'united-kingdom',
            }),
            createOrderedMap({
                type: 'object',
                properties: {
                    country: {
                        type: 'string',
                    },
                },
            }),// distSchema
            createOrderedMap({
                type: 'object',
                properties: {
                    country: {
                        type: 'string',
                    },
                    'region': {
                        'type': 'string',
                        'const': 'scottland',
                    },
                },
            }),// expectedSchema
            true,// expected
        ],
    ] as [StoreSchemaType, Map<string, string | number>, StoreSchemaType, StoreSchemaType, boolean][])(
        'handleIfElseThen(%j, store, distSchema)',
        (schema, store, distSchema, expectedSchema, expected) => {
            expect(handleIfElseThen(schema, store, distSchema).equals(expectedSchema)).toBe(expected)
        }
    )
})
