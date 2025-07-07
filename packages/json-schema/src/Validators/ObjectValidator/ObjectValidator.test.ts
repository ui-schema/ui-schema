import { test, expect, describe } from '@jest/globals'
import { makeParams } from '@ui-schema/json-schema/Validator'
import { ERROR_PATTERN } from '@ui-schema/json-schema/Validators'
import {
    validateObject,
    ERROR_ADDITIONAL_PROPERTIES, objectValidator,
} from '@ui-schema/json-schema/Validators/ObjectValidator'
import { createMap, createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { newMockState } from '../../../tests/mocks/ValidatorState.mock.js'


describe('validateObject', () => {
    test.each([
        [
            {type: 'object'},
            {},
            0,
        ],
        [
            {
                type: 'object', additionalProperties: false,
                properties: {
                    name: {
                        type: 'string',
                    },
                },
            },
            {name: 'demo'},
            0,
        ],
        [
            {
                type: 'object', additionalProperties: false,
                properties: {
                    name: {
                        type: 'number',
                    },
                },
            },
            {name: 'demo'},
            0,
        ],
        [
            {
                type: 'object', additionalProperties: false,
                properties: {
                    name: {
                        type: 'number',
                    },
                },
            },
            {name: 'demo', street: 'long-street'},
            1,
        ],
        [
            {
                type: 'object', additionalProperties: false,
                properties: {
                    name: {
                        type: 'number',
                    },
                },
            },
            createMap({name: 'demo'}),
            0,
        ],
        [
            {
                type: 'object', additionalProperties: false,
                properties: {
                    name: {
                        type: 'number',
                    },
                },
            },
            createMap({name: 'demo', street: 'long-street'}),
            1,
        ],
        [
            {
                type: 'object',
                propertyNames: {
                    pattern: '^((?!user).)*$',
                },
            },
            createMap({name: 'abc'}),
            0,
        ],
        [
            {
                type: 'object',
                propertyNames: {
                    pattern: '^((?!user).)*$',
                },
            },
            {name: 'abc'},
            0,
        ],
        [
            {
                type: 'object',
                propertyNames: {
                    pattern: '^((?!user).)*$',
                },
            },
            {name_user: 'abc'},
            1,
        ],
    ])('validateObject(%j, %j)', (schema, value, expected) => {
        const state = newMockState()
        validateObject(createOrderedMap(schema), value, {...makeParams(), ...state})
        expect(state.output.errCount).toBe(expected)
    })
})

describe('objectValidator', () => {
    const testCases: [any, any, any, boolean][] = [
        [
            {type: 'object'},
            {},
            [],
            true,
        ],
        [
            {
                type: 'object',
                additionalProperties: false,
                properties: {
                    name: {
                        type: 'number',
                    },
                },
            },
            {name: 'demo'},
            [],
            true,
        ],
        [
            {
                type: 'object',
                additionalProperties: false,
                properties: {
                    name: {
                        type: 'number',
                    },
                },
            },
            {name: 'demo', street: 'long-street'},
            [{error: ERROR_ADDITIONAL_PROPERTIES, instanceLocation: '', keywordLocation: '/additionalProperties'}],
            false,
        ],
        [
            {
                type: 'object',
                propertyNames: {
                    pattern: '^((?!user).)*$',
                },
            },
            {name: 'demo'},
            [],
            true,
        ],
        [
            {
                type: 'object',
                propertyNames: {
                    pattern: '^((?!user).)*$',
                },
            },
            {name_user: 'demo'},
            [{error: ERROR_PATTERN, context: {'pattern': '^((?!user).)*$', 'patternError': undefined}, instanceLocation: '', keywordLocation: '/propertyNames/pattern'}],
            false,
        ],
    ]

    test.each(testCases)(
        'objectValidator.validate(%j, %s)',
        (schema, value, errors, expectedValid) => {
            const state = newMockState()
            objectValidator.validate(
                createOrderedMap(schema),
                value,
                {...makeParams(), ...state},
            )
            expect(state.output.errCount === 0).toBe(expectedValid)
            expect(state.output.errors).toStrictEqual(errors)
        },
    )

    test.each(testCases)(
        'objectValidator.validate(%j, %s) - as immutable',
        (schema, value, errors, expectedValid) => {
            const state = newMockState()
            objectValidator.validate(
                createOrderedMap(schema),
                createOrderedMap(value),
                {...makeParams(), ...state},
            )
            expect(state.output.errCount === 0).toBe(expectedValid)
            expect(state.output.errors).toStrictEqual(errors)
        },
    )
})
