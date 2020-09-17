import { List, Map, OrderedMap } from "immutable"
import { ERROR_WRONG_TYPE, typeValidator, validateType } from '@ui-schema/ui-schema/Validators/TypeValidator'
import { createValidatorErrors } from "@ui-schema/ui-schema/ValidatorStack/ValidatorErrors"

describe('validateType', () => {
    test.each([
        // unknown types are never valid, but on value `undefined`
        ['text1', 'stringiiii', false],
        [undefined, 'stringiiii', true],

        ['text1', 'string', true],
        [undefined, 'string', true],
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

describe('typeValidator', () => {
    test.each([
        [
            'string',
            'text1',
            List([ERROR_WRONG_TYPE, Map({actual: typeof 'text1'})]),
            true,
            false,
        ], [
            'string',
            2,
            List([ERROR_WRONG_TYPE, Map({actual: typeof 2})]),
            false,
            true,
        ], [
            'string',
            false,
            List([ERROR_WRONG_TYPE, Map({actual: typeof false})]),
            false,
            true,
        ], [
            'string',
            '2',
            List([ERROR_WRONG_TYPE, Map({actual: typeof '2'})]),
            true,
            false,
        ],
    ])(
        '.should(%j, %s)',
        (type, value, error, expectedValid, expectedError) => {
            const result = typeValidator.validate({
                schema: OrderedMap({type}),
                value,
                errors: createValidatorErrors(),
                valid: true,
            })
            expect(result.valid).toBe(expectedValid)
            expect(result.errors.hasError(error.get(0))).toBe(expectedError)
            if (result.errors.hasError(error.get(0))) {
                expect(result.errors.getError(error.get(0)).get(0).equals(error.get(1))).toBe(expectedError)
            }
        }
    )
})
