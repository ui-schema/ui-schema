import { expect, describe, test } from '@jest/globals'
import { Map } from 'immutable'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { handleIfElseThen } from '@ui-schema/react-json-schema/ConditionalHandler'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { newMockStateNested } from '../../../json-schema/tests/mocks/ValidatorState.mock.js'

/**
 * npm test -- --testPathPattern=ConditionalHandler --watch --watchman --coverage=false
 * npm run tdd -- --testPathPattern=ConditionalHandler
 * npm run tdd -- --runTestsByPath=packages/react-json-schema/src/ConditionalHandler
 * npm run tdd -- --runTestsByPath "./packages/react-json-schema/src/ConditionalHandler"
 * npm run tdd -- --runTestsByPath "./packages/react-json-schema/src/ConditionalHandler/handleIfElseThen.test.ts" --selectProjects test-@ui-schema/react-json-schema
 * npm run test -- --runTestsByPath "./packages/react-json-schema/src/ConditionalHandler/handleIfElseThen.test.ts"
 * npm run test -- --runTestsByPath "./packages/react-json-schema/src/ConditionalHandler/handleIfElseThen.test.ts" --selectProjects test-@ui-schema/react-json-schema
 */


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
        [
            createOrderedMap({
                type: 'number',
                if: {
                    minimum: 10,
                },
                then: {
                    maximum: 40,
                },
                else: {
                    maximum: 8,
                },
            }/* as JsonSchema*/),
            12,
            createOrderedMap({
                type: 'number',
            }),// distSchema
            createOrderedMap({
                type: 'number',
                maximum: 40,
            }),// expectedSchema
            true,// expected
        ],
        [
            createOrderedMap({
                type: 'number',
                if: {
                    minimum: 10,
                },
                then: {
                    maximum: 40,
                },
                else: {
                    maximum: 8,
                },
            }/* as JsonSchema*/),
            6,
            createOrderedMap({
                type: 'number',
            }),// distSchema
            createOrderedMap({
                type: 'number',
                maximum: 8,
            }),// expectedSchema
            true,// expected
        ],
    ] as [UISchemaMap, Map<string, string | number>, UISchemaMap, UISchemaMap, boolean][])(
        'handleIfElseThen(%j, store, distSchema)',
        (schema, store, distSchema, expectedSchema, expected) => {
            const state = newMockStateNested()
            const result = handleIfElseThen(schema, store, distSchema, state)
            const equals = result.equals(expectedSchema)
            if (equals !== expected) {
                console.log(
                    'failed handleIfElseThen',
                    JSON.stringify(result, undefined, 2),
                )
            }
            expect(equals).toBe(expected)
        },
    )
})
