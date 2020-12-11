import { OrderedMap, List } from 'immutable'
import {
    validateEnum, valueValidatorEnum, ERROR_ENUM_MISMATCH,
} from '@ui-schema/ui-schema/Validators/ValueValidator'
import { createValidatorErrors } from '@ui-schema/ui-schema/ValidatorStack/ValidatorErrors'

describe('validateEnum', () => {
    test('validateEnum', () => {
        expect(validateEnum(
            'string',
            List(['text1', 'text2']),
            'text1'
        )).toBe(true)
        expect(validateEnum(
            'string',
            List(['text1', 'text2']),
            'text3'
        )).toBe(false)
        expect(validateEnum(
            'string',
            ['text1', 'text2'],
            'text1'
        )).toBe(true)
        expect(validateEnum(
            'string',
            ['text1', 'text2'],
            'text3'
        )).toBe(false)

        expect(validateEnum(
            'number',
            List([1, 2]),
            1
        )).toBe(true)
        expect(validateEnum(
            'number',
            List([1, 2]),
            3
        )).toBe(false)

        expect(validateEnum(
            'integer',
            List([1, 2]),
            1
        )).toBe(true)
        expect(validateEnum(
            'integer',
            List([1, 2]),
            3
        )).toBe(false)

        expect(validateEnum(
            'boolean',
            List([true]),
            true
        )).toBe(true)
        expect(validateEnum(
            'boolean',
            List([true]),
            false
        )).toBe(false)

        expect(validateEnum(
            'null',
            List([null]),
            null
        )).toBe(true)
        expect(validateEnum(
            'null',
            List([null]),
            'null'
        )).toBe(false)

        expect(validateEnum(
            'array',
            List([]),
            []
        )).toBe(true)
        expect(validateEnum(
            'array',
            [],
            []
        )).toBe(true)
        expect(validateEnum(
            'array'
        )).toBe(true)
        expect(validateEnum('string', undefined, 'text1')).toBe(true)
        expect(validateEnum('string')).toBe(true)
    })
})

describe('valueValidatorEnum', () => {
    test.each([
        [
            {enum: []},
            'text1',
            true,
        ], [
            {},
            'text1',
            false,
        ], [
            {enum: []},
            undefined,
            false,
        ],
    ])(
        '.should(%j, %s)',
        (schema, value, expected) => {
            expect(valueValidatorEnum.should({
                schema: OrderedMap(schema),
                value,
            })).toBe(expected)
        }
    )

    test.each([
        [
            {type: 'string', enum: List(['text1', 'text2'])},
            'text1',
            ERROR_ENUM_MISMATCH,
            true,
            false,
        ], [
            {type: 'string', enum: List(['text1', 'text2'])},
            'text3',
            ERROR_ENUM_MISMATCH,
            false,
            true,
        ], [
            {type: 'string'},
            'text3',
            ERROR_ENUM_MISMATCH,
            true,
            false,
        ],
    ])(
        '.validate(%j, %s)',
        (schema, value, error, expectedValid, expectedError) => {
            const result = valueValidatorEnum.validate({
                schema: OrderedMap(schema),
                value,
                errors: createValidatorErrors(),
                valid: true,
            })
            expect(result.valid).toBe(expectedValid)
            expect(result.errors.hasError(error)).toBe(expectedError)
        }
    )
})
