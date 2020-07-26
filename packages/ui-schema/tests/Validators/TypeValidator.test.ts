import { OrderedMap, List, Map } from "immutable"
import {
    validateType, typeValidator, ERROR_WRONG_TYPE
} from '@ui-schema/ui-schema/Validators/TypeValidator'

describe('validateType', () => {
    test.each([
        ['text1', 'string', true],
        [undefined, 'string', true],
        [1, 'string', false],
        [1, 'number', true],
        [1.1, 'number', true],
        ['1', 'number', false],
        [1, 'integer', true],
        [1.1, 'integer', false],
        ['1', 'integer', false],
        [true, 'boolean', true],
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
    ])('validateType(%j, %s)', (value, type, expected) => {
        expect(validateType(value, type)).toBe(expected)
    })
})

describe('typeValidator', () => {
    test.each([
        [
            'string',
            'text1',
            true
        ], [
            'string',
            2,
            false
        ], [
            'string',
            false,
            false
        ], [
            'string',
            '2',
            true
        ]
    ])(
        '.should(%j, %s)',
        (type, value, expected) => {
            const result = typeValidator.validate({
                schema: OrderedMap({type}),
                value,
                errors: List([]),
                valid: true
            })
            expect(result.valid).toBe(expected)
            // expect(result.errors).toBe(expected)
        }
    )
})
