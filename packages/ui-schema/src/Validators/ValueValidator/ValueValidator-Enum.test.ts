import { OrderedMap, List } from 'immutable'
import {
    validateEnum, valueValidatorEnum, ERROR_ENUM_MISMATCH,
} from '@ui-schema/ui-schema/Validators/ValueValidator'
import { createValidatorErrors } from '@ui-schema/ui-schema/ValidatorErrors'

/**
 * npm run tdd -- -u --testPathPattern=src/Validators/ValueValidator/ValueValidator-Enum.test.ts
 */

describe('validateEnum', () => {
    test.each([
        [
            List(['text1', 'text2']),
            'text1',
            true,
        ], [
            List(['text1', 'text2']),
            'text3',
            false,
        ], [
            List(['text1', 'text2']),
            'text1',
            true,
        ], [
            List(['text1', 'text2']),
            'text3',
            false,
        ], [
            List(['text1', 'text2']),
            'text1',
            true,
        ], [
            List(['text1', 'text2']),
            'text3',
            false,
        ], [
            List([null]),
            null,
            true,
        ], [
            List([null]),
            null,
            true,
        ], [
            List(['text1', 'text2', null]),
            'text1',
            true,
        ], [
            List(['text1', 'text2', null]),
            null,
            true,
        ], [
            List(['text1', 'text2']),
            'text3',
            false,
        ], [
            ['text1', 'text2'],
            'text1',
            true,
        ], [
            ['text1', 'text2'],
            'text3',
            false,
        ], [
            List([1, 2]),
            1,
            true,
        ], [
            List([1, 2]),
            3,
            false,
        ], [
            List([1, 2]),
            1,
            true,
        ], [
            List([1, 2]),
            3,
            false,
        ], [
            List([true]),
            true,
            true,
        ], [
            List([true]),
            false,
            false,
        ], [
            List([null]),
            null,
            true,
        ], [
            List([null]),
            'null',
            false,
        ], [
            List([]),
            [],
            false,
        ], [
            [],
            [],
            false,
        ],
    ])('validateEnum(%j, %j, %j): %j', (_enum: any, value: any, expected: boolean) => {
        expect(validateEnum(_enum, value)).toBe(expected)
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
