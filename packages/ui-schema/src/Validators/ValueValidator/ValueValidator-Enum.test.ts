import { OrderedMap, List } from 'immutable'
import {
    validateEnum, valueValidatorEnum, ERROR_ENUM_MISMATCH,
} from '@ui-schema/ui-schema/Validators/ValueValidator'
import { createValidatorErrors } from '@ui-schema/ui-schema/ValidatorErrors'
import { SchemaTypesType } from '@ui-schema/ui-schema'

describe('validateEnum', () => {
    test.each([
        [
            'string',
            List(['text1', 'text2']),
            'text1',
            true,
        ], [
            'string',
            List(['text1', 'text2']),
            'text3',
            false,
        ], [
            List(['string']),
            List(['text1', 'text2']),
            'text1',
            true,
        ], [
            List(['string']),
            List(['text1', 'text2']),
            'text3',
            false,
        ], [
            List(['string', 'integer']),
            List(['text1', 'text2']),
            'text1',
            true,
        ], [
            List(['string', 'integer']),
            List(['text1', 'text2']),
            'text3',
            false,
        ], [
            List(['object']),
            List([null]),
            null,
            true,
        ], [
            List(['string', 'integer']),
            List([null]),
            null,
            true,
        ], [
            List(['string', 'integer', 'null']),
            List(['text1', 'text2', null]),
            'text1',
            true,
        ], [
            List(['string', 'integer', 'null']),
            List(['text1', 'text2', null]),
            null,
            true,
        ], [
            List(['string', 'integer', 'null']),
            List(['text1', 'text2']),
            'text3',
            false,
        ], [
            'string',
            ['text1', 'text2'],
            'text1',
            true,
        ], [
            'string',
            ['text1', 'text2'],
            'text3',
            false,
        ], [
            'number',
            List([1, 2]),
            1,
            true,
        ], [
            'number',
            List([1, 2]),
            3,
            false,
        ], [
            'integer',
            List([1, 2]),
            1,
            true,
        ], [
            'integer',
            List([1, 2]),
            3,
            false,
        ], [
            'boolean',
            List([true]),
            true,
            true,
        ], [
            'boolean',
            List([true]),
            false,
            false,
        ], [
            'null',
            List([null]),
            null,
            true,
        ], [
            'null',
            List([null]),
            'null',
            false,
        ], [
            'array',
            List([]),
            [],
            true,
        ], [
            'array',
            [],
            [],
            true,
        ],
    ])('validateEnum(%j, %j, %j): %j', (type: SchemaTypesType, _enum: any, value: any, expected: boolean) => {
        expect(validateEnum(type, _enum, value)).toBe(expected)
    })
    test('validateEnum', () => {
        expect(validateEnum('array')).toBe(true)
        expect(validateEnum('string', undefined, 'text1')).toBe(true)
        expect(validateEnum(undefined, ['text1'], 'text1')).toBe(true)
        expect(validateEnum(undefined, ['text1'], 'text2')).toBe(true)
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
                // @ts-ignore
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
        '.handle(%j, %s)',
        (schema, value, error, expectedValid, expectedError) => {
            const result = valueValidatorEnum.handle({
                schema: OrderedMap(schema),
                // @ts-ignore
                value,
                errors: createValidatorErrors(),
                valid: true,
            })
            expect(result.valid).toBe(expectedValid)
            expect(result.errors.hasError(error)).toBe(expectedError)
        }
    )
})
