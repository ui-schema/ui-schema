import { OrderedMap, List, Map } from "immutable"
import {
    checkValueExists, requiredValidator, ERROR_NOT_SET
} from '@ui-schema/ui-schema/Validators/RequiredValidator'

describe('checkValueExists', () => {
    test.each([
        ['text1', 'string', true],
        ['', 'string', false],
        [undefined, 'string', false],
        [1, 'number', true],
        // ['1', 'number', false],
        [undefined, 'number', false],
        [1, 'integer', true],
        [undefined, 'integer', false],
        [true, 'boolean', true],
        // [false, 'boolean', true],
        [undefined, 'boolean', false],
        [[''], 'array', true],
        [List(['']), 'array', true],
        [undefined, 'array', false],
        [{text: ''}, 'object', true],
        [undefined, 'object', false],
        [Map({text: ''}), 'object', true],
        [OrderedMap({text: ''}), 'object', true],
        [[], 'object', false]
    ])('checkValueExists(%j, %s)', (value, type, expected) => {
        expect(checkValueExists(type, value)).toBe(expected)
    })
})

describe('requiredValidator', () => {
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
            '',
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
        '.validate(%j, %s)',
        (type, value, expected) => {
            const result = requiredValidator.validate({
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
