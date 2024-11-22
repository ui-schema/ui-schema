import { expect, describe, test } from '@jest/globals'
import { OrderedMap, Map } from 'immutable'
import {
    validateConst, valueValidatorConst, ERROR_CONST_MISMATCH,
} from '@ui-schema/json-schema/Validators/ValueValidator'
import { createValidatorErrors } from '@ui-schema/system/ValidatorErrors'

describe('validateConst', () => {
    test('validateConst', () => {
        expect(validateConst('text1', 'text1')).toBe(true)
        expect(validateConst('text1', 'text2')).toBe(false)

        expect(validateConst(1, 1)).toBe(true)
        expect(validateConst(1, 2)).toBe(false)

        expect(validateConst(true, true)).toBe(true)
        expect(validateConst(true, false)).toBe(false)

        expect(validateConst(null, null)).toBe(true)
        expect(validateConst(null, 'null')).toBe(false)
    })
})

describe('valueValidatorConst', () => {
    test.each([
        [
            {const: ''},
            'text1',
            true,
        ], [
            {},
            'text1',
            false,
        ], [
            {const: ''},
            undefined,
            false,
        ],
    ])(
        '.should(%j, %s)',
        (schema, value, expected) => {
            expect(valueValidatorConst.should?.({
                schema: OrderedMap(schema),
                value,
                errors: createValidatorErrors(),
            })).toBe(expected)
        },
    )

    type valueValidatorConstTest = [
        // schema:
        {},
        // value:
        any,
        // error:
        [string, Map<string, unknown>],
        // expectedValid:
        boolean,
        // expectedError:
        boolean
    ]

    const valueValidatorConstTestValues: valueValidatorConstTest[] = [
        [
            {const: 'text1'},
            'text1',
            [ERROR_CONST_MISMATCH, Map({const: 'text1'})] as const,
            true,
            false,
        ], [
            {const: 'text1'},
            'text3',
            [ERROR_CONST_MISMATCH, Map({const: 'text1'})] as const,
            false,
            true,
        ], [
            {},
            'text3',
            [ERROR_CONST_MISMATCH, Map({const: 'text1'})] as const,
            true,
            false,
        ],
    ]

    test.each(valueValidatorConstTestValues)(
        '.handle(%j, %s)',
        (schema, value, error, expectedValid, expectedError) => {
            const result = valueValidatorConst.handle({
                schema: OrderedMap(schema),
                value,
                errors: createValidatorErrors(),
                valid: true,
            })
            expect(result.valid).toBe(expectedValid)
            expect(result.errors?.hasError(error[0])).toBe(expectedError)
            if (result.errors?.hasError(error[0])) {
                expect(result.errors?.getError(error[0]).get(0)?.equals(error[1])).toBe(expectedError)
            }
        },
    )
})
