import { OrderedMap, List, Map } from "immutable"
import {
    validateConst, valueValidatorConst, ERROR_CONST_MISMATCH,
} from '@ui-schema/ui-schema/Validators/ValueValidator'
import { createValidatorErrors } from "@ui-schema/ui-schema/ValidatorStack/ValidatorErrors"

describe('validateConst', () => {
    test('validateConst', () => {
        expect(validateConst('string', 'text1', 'text1')).toBe(true)
        expect(validateConst('string', 'text1', 'text2')).toBe(false)

        expect(validateConst('number', 1, 1)).toBe(true)
        expect(validateConst('number', 1, 2)).toBe(false)

        expect(validateConst('integer', 1, 1)).toBe(true)
        expect(validateConst('integer', 1, 2)).toBe(false)

        expect(validateConst('boolean', true, true)).toBe(true)
        expect(validateConst('boolean', true, false)).toBe(false)
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
            expect(valueValidatorConst.should({
                schema: OrderedMap(schema),
                value,
            })).toBe(expected)
        }
    )

    type valueValidatorConstTest = [
        // schema:
        {},
        // value:
        any,
        // error:
        List<any>,
        // expectedValid:
        boolean,
        // expectedError:
        boolean
    ]

    const valueValidatorConstTestValues: valueValidatorConstTest[] = [
        [
            {type: 'string', const: 'text1'},
            'text1',
            List([ERROR_CONST_MISMATCH, Map({const: 'text1'})]),
            true,
            false,
        ], [
            {type: 'string', const: 'text1'},
            'text3',
            List([ERROR_CONST_MISMATCH, Map({const: 'text1'})]),
            false,
            true,
        ], [
            {type: 'string'},
            'text3',
            List([ERROR_CONST_MISMATCH, Map({const: 'text1'})]),
            true,
            false,
        ],
    ]

    test.each(valueValidatorConstTestValues)(
        '.validate(%j, %s)',
        (schema, value, error, expectedValid, expectedError) => {
            const result = valueValidatorConst.validate({
                schema: OrderedMap(schema),
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
