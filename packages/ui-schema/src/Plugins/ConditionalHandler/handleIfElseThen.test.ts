import { Map } from 'immutable'
import { createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap/createMap'
import { handleIfElseThen } from '@ui-schema/ui-schema/Plugins/ConditionalHandler/handleIfElseThen'

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
            createOrderedMap({
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
    ] as [Map<any, undefined>, Map<any, undefined>, Map<any, undefined>, Map<any, undefined>, boolean][])(
        'handleIfElseThen(%j, store, distSchema)',
        (schema, store, distSchema, expectedSchema, expected) => {
            expect(handleIfElseThen(schema, store, distSchema).equals(expectedSchema)).toBe(expected)
        },
    )
    /*const distSchema = createMap({if: { test: 'string2'}, then: { test: 'string2'},else: {}})
    const correctStore = createMap({if: { test: 'string2'}, then: { test: 'string2'},else: {}})
    const incorrectStore = createMap({if: { test: 3}, then: {test: 2},else: {test: 1}})
    const demoSchema = createMap({if: { test: 'string'}, then: { test: 'string'},else: {} })
    const validateSchemaObjectFn = validateSchemaObject(demoSchema, emptySchema)*/
    /*const validateSchemaObjectFnFalse = validateSchemaObject(demoSchema, incorrectStore) */

    /*test('!if', () => {
        const emptySchema = createMap({})
        handleIfElseThen(emptySchema, emptySchema, emptySchema)
        // expect(validateSchemaObject(demoSchema, emptySchema)).not.toHaveBeenCalled()
        expect(handleIfElseThen(emptySchema, emptySchema, createMap({'dummy': {}}))).toMatchObject(createMap({'dummy': {}}))
    })*/

    /*test('if && then', () => {
        const result = handleIfElseThen(demoSchema, correctStore, distSchema)
        expect(validateSchemaObject(demoSchema, correctStore).size).toEqual(0)
        // @ts-ignore
        expect(validateSchemaObject(demoSchema, incorrectStore).size).toBeGreaterThan(0)
        const validateSchemaObjectFn = jest.fn()
        expect(validateSchemaObjectFn).toHaveBeenCalled()
        // expect(result).toEqual(createMap({if: { test: 'string2'}, then: { test: 'string'},else: {}}))
        expect(result).toEqual(mergeSchema(distSchema, demoSchema.get('then')))
    })*/
    /*test('if && !then', () => {
        const result2 = handleIfElseThen(createMap({if: { test: 'string'}}), correctStore, distSchema)
        // expect(validateSchemaObject(createMap({if: { test: 'string'}}), correctStore)).toHaveBeenCalled()
        expect(result2).toMatchObject(distSchema)
    })*/
})
