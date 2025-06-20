import { expect, describe, test } from '@jest/globals'
import { checkValueExists } from '@ui-schema/json-schema/Validators/RequiredValidator'

describe('checkValueExists', () => {
    test.each([
        ['text1', 'string', true],
        ['', 'string', false],
        [undefined, 'string', false],
        [0, 'string', true],
        [true, 'string', true],
        [[], 'string', true],
        [{}, 'string', true],
        [0, 'number', true],
        ['', 'number', false],
        ['', 'number', false],
        [0, 'integer', true],
        ['', 'integer', false],
        ['', 'integer', false],
        [true, 'boolean', true],
        [false, 'boolean', true],
        [undefined, 'boolean', false],
        [[], 'array', true],
        ['', 'array', true],
        [undefined, 'array', false],
        [{}, 'object', true],
        ['', 'object', true],
        [undefined, 'object', false],
    ] as [any, string, boolean][])('checkValueExists(%j, %s)', (value, type, expected) => {
        expect(checkValueExists(type, value)).toBe(expected)
    })
})
