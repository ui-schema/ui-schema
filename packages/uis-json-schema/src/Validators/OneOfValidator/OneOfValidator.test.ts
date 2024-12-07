import { jest, describe, test, expect } from '@jest/globals'
import { makeParams } from '@ui-schema/json-schema/Validator'
import { createOrderedMap } from '@ui-schema/system/createMap'
import { validateOneOf } from '@ui-schema/json-schema/Validators/OneOfValidator'
import { newMockState } from '../../../tests/mocks/ValidatorState.mock.js'

/**
 * npm run tdd -- --testPathPattern=src/Validators/OneOfValidator/OneOfValidator.test.ts
 */
jest.setTimeout(3000)

describe('validateOneOf', () => {
    test.each([
        [{
            oneOf: [
                {type: 'string'},
            ],
        }, '1', 0, undefined],
        [{
            oneOf: [
                {type: 'number'},
            ],
        }, '1', 1, [{'context': {'actual': 'string'}, 'error': 'wrong-type', instanceLocation: '', keywordLocation: '/oneOf/type'}]],
        [{
            oneOf: [
                {type: 'number'},
            ],
        }, 1, 0, undefined],
        [{
            oneOf: [
                {type: 'string'},
            ],
        }, 1, 1, [{'context': {'actual': 'number'}, 'error': 'wrong-type', instanceLocation: '', keywordLocation: '/oneOf/type'}]],
        [{
            oneOf: [
                {type: 'number'},
                {type: 'string'},
            ],
        }, 1, 0, undefined],
        [{
            oneOf: [
                {type: 'number'},
                {type: 'string'},
            ],
        }, '1', 0, undefined],
        [{
            oneOf: [
                {
                    type: 'string',
                    oneOf: [
                        {type: 'string', const: 'valid-a'},
                        {type: 'string', const: 'valid-b'},
                    ],
                },
            ],
        }, 'valid-a', 0, undefined],
        [{
            oneOf: [
                {
                    type: 'string',
                    oneOf: [
                        {type: 'string', const: 'valid-a'},
                        {type: 'string', const: 'valid-b'},
                    ],
                },
            ],
        }, 'valid-b', 0, undefined],
        [{
            oneOf: [
                {
                    type: 'string',
                    oneOf: [
                        {type: 'string', const: 'valid-a'},
                        {type: 'string', const: 'valid-b'},
                    ],
                },
            ],
        }, 'invalid', 1, [
            {'error': 'const-mismatch', context: {const: 'valid-a'}, instanceLocation: '', keywordLocation: '/oneOf/oneOf/const'},
            {'error': 'const-mismatch', context: {const: 'valid-b'}, instanceLocation: '', keywordLocation: '/oneOf/oneOf/const'},
        ]],
    ])('oneOfValidator(%j, %j)', (schema, value, expectedErrorCount, expectedErrors) => {
        const state = newMockState()
        const r = validateOneOf(createOrderedMap(schema).get('oneOf'), value, makeParams(), state)
        if (r.errorCount !== expectedErrorCount) {
            console.log(
                'failed oneOfValidator',
                schema, value,
                r,
                JSON.stringify(state.output.errors, undefined, 2),
            )
        }
        expect(r.errorCount).toBe(expectedErrorCount)
        if (expectedErrors) {
            expect(state.output.errors).toStrictEqual(expectedErrors)
        } else {
            expect(state.output.errors).toStrictEqual([])
        }
    })
})
