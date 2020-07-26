import { List, Map, OrderedMap } from "immutable"
import { checkValueExists, ERROR_NOT_SET, requiredValidator } from '@ui-schema/ui-schema/Validators/RequiredValidator'

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
        [[], 'array', false],
        [List(['']), 'array', true],
        [List([]), 'array', false],
        [undefined, 'array', false],
        [{text: ''}, 'object', true],
        [undefined, 'object', false],
        [Map({text: ''}), 'object', true],
        [Map({}), 'object', false],
        [OrderedMap({text: ''}), 'object', true],
        [[], 'object', false]
    ])('checkValueExists(%j, %s)', (value, type, expected) => {
        expect(checkValueExists(type, value)).toBe(expected)
    })
})

describe('requiredValidator', () => {
    test.each([
        [['name'], 'name', true],
        [['name'], 'street', false],
        [undefined, 'name', false]
    ])(
        '.should(%j, %s)',
        (required, ownKey, expectedValid) => {
            expect(requiredValidator.should({
                required: List(required),
                ownKey
            })).toBe(expectedValid)
        }
    )

    test.each([
        [
            'string',
            'text1',
            ERROR_NOT_SET,
            true,
            false
        ], [
            'string',
            2,
            ERROR_NOT_SET,
            false,
            true
        ], [
            'string',
            '',
            ERROR_NOT_SET,
            false,
            true
        ], [
            'string',
            false,
            ERROR_NOT_SET,
            false,
            true
        ], [
            'string',
            '2',
            ERROR_NOT_SET,
            true,
            false
        ]
    ])(
        '.validate(%j, %s)',
        (type, value, error, expectedValid, expectedError) => {
            const result = requiredValidator.validate({
                schema: OrderedMap({type}),
                value,
                errors: List([]),
                valid: true
            })
            expect(result.valid).toBe(expectedValid)
            expect(result.errors.contains(error)).toBe(expectedError)
        }
    )

    test(
        '.noValidate(%j, %s)',
        () => {
            const result = requiredValidator.noValidate()
            expect(result.required).toBe(false)
        }
    )
})
