import { jest, describe, test, expect } from '@jest/globals'
import { createOrderedMap } from '@ui-schema/system/createMap'
import { validateOneOf } from '@ui-schema/json-schema/Validators/OneOfValidator'

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
        }, '1', 1, {'wrong-type': [{}]}],
        [{
            oneOf: [
                {type: 'number'},
            ],
        }, 1, 0, undefined],
        [{
            oneOf: [
                {type: 'string'},
            ],
        }, 1, 1, {'wrong-type': [{}]}],
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
        }, 'invalid', 1, {'const-mismatch': [{}, {}]}],
    ])('oneOfValidator(%j, %j)', (schema, value, expectedErrorCount, expectedErrors) => {
        const r = validateOneOf(createOrderedMap(schema).get('oneOf'), value)
        expect(r.errorCount).toBe(expectedErrorCount)
        if (expectedErrors) {
            expect(r.errors.getErrors().toJS()).toStrictEqual(expectedErrors)
        } else {
            expect(r.errors.getErrors().toJS()).toStrictEqual({})
        }
    })
})
