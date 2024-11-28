import { expect, describe, test } from '@jest/globals'
import { List, Map, OrderedMap } from 'immutable'
import { validateType, validateTypes } from '@ui-schema/json-schema/Validators/TypeValidator'

describe('validateType', () => {
    test.each([
        // unknown types are never valid, but on value `undefined`
        ['text1', 'stringiiii', false],
        [undefined, 'stringiiii', true],

        ['text1', 'string', true],
        [undefined, 'string', true],
        ['1', 'string', true],
        [1, 'string', false],
        [null, 'string', false],

        [1, 'number', true],
        [1.1, 'number', true],
        ['1', 'number', false],

        [1, 'integer', true],
        [1.1, 'integer', false],
        ['1', 'integer', false],

        [true, 'boolean', true],
        [false, 'boolean', true],
        [0, 'boolean', false],
        ['0', 'boolean', false],
        [[], 'boolean', false],

        [[], 'array', true],
        [List([]), 'array', true],
        ['text', 'array', false],
        [{}, 'array', false],

        [{}, 'object', true],
        [undefined, 'object', true],
        [Map({}), 'object', true],
        [OrderedMap({}), 'object', true],
        ['text', 'object', false],
        [[], 'object', false],
        [null, 'null', true],
        ['null', 'null', false],

    ])('validateType(%j, %s): %j', (value, type, expected) => {
        expect(validateType(value, type)).toBe(expected)
    })
})

describe('validateTypes', () => {
    test.each([
        [
            'text1',
            'string',
            // [ERROR_WRONG_TYPE, Map({actual: typeof 'text1'})] as const,
            true,
        ],
        [
            2,
            'string',
            // [ERROR_WRONG_TYPE, Map({actual: typeof 2})] as const,
            false,
        ],
        [
            undefined,
            'string',
            // [ERROR_WRONG_TYPE, Map({actual: typeof undefined})] as const,
            true,
        ],
        [
            false,
            'string',
            // [ERROR_WRONG_TYPE, Map({actual: typeof false})] as const,
            false,
        ],
        [
            '2',
            'string',
            // [ERROR_WRONG_TYPE, Map({actual: typeof '2'})] as const,
            true,
        ],
        [
            false,
            List(['string']),
            // [ERROR_WRONG_TYPE, Map({actual: typeof false})] as const,
            false,
        ],
        [
            '2',
            List(['string']),
            // [ERROR_WRONG_TYPE, Map({actual: typeof '2'})] as const,
            true,
        ],
        [
            false,
            List(['string', 'null']),
            // [ERROR_WRONG_TYPE, Map({actual: typeof false})] as const,
            false,
        ],
        [
            false,
            List(['null', 'string']),
            // [ERROR_WRONG_TYPE, Map({actual: typeof false})] as const,
            false,
        ],
        [
            '2',
            List(['string', 'null']),
            // [ERROR_WRONG_TYPE, Map({actual: typeof '2'})] as const,
            true,
        ],
        [
            '2',
            List(['null', 'string']),
            // [ERROR_WRONG_TYPE, Map({actual: typeof '2'})] as const,
            true,
        ],
        [
            null,
            List(['string', 'null']),
            // [ERROR_WRONG_TYPE, Map({actual: typeof null})] as const,
            true,
        ],
        [
            null,
            List(['null', 'string']),
            // [ERROR_WRONG_TYPE, Map({actual: typeof null})] as const,
            true,
        ],
    ])(
        'validateTypes(%j, %s)',
        (value, type, expectedValid) => {
            expect(validateTypes(value, type)).toBe(expectedValid)
        },
    )
})
