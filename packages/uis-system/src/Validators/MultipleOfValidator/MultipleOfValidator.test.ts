import { OrderedMap, List, Map } from 'immutable'
import {
    validateMultipleOf, multipleOfValidator, ERROR_MULTIPLE_OF,
} from '@ui-schema/system/Validators/MultipleOfValidator'
import { createOrderedMap } from '@ui-schema/system/createMap'
import { UISchema, JsonSchemaNumber } from '@ui-schema/system/Definitions'
import { createValidatorErrors } from '@ui-schema/system/ValidatorErrors'

describe('validateMultipleOf', () => {
    type validateMultipleOfTest = [
        // schema:
        (JsonSchemaNumber & UISchema),
        // value:
        any,
        // expected:
        boolean
    ]
    const validateMultipleOfTestValues: validateMultipleOfTest[] = [
        [
            {type: 'number', multipleOf: 2},
            2,
            true,
        ], [
            {type: 'number', multipleOf: 2},
            3,
            false,
        ], [
            {type: 'number', multipleOf: 2},
            4,
            true,
        ], [
            {type: 'number', multipleOf: 2},
            -4,
            true,
        ], [
            {type: 'number', multipleOf: 2},
            0,
            true,
        ], [
            {type: 'number', multipleOf: 15},
            30,
            true,
        ], [
            {type: 'number', multipleOf: 150},
            300,
            true,
        ], [
            {type: 'number', multipleOf: 15000},
            300000,
            true,
        ], [
            {type: 'number', multipleOf: 15000000000},
            300000000000,
            true,
        ], [
            {type: 'number', multipleOf: 2},
            undefined,
            true,
        ], [
            {type: 'number'},
            undefined,
            true,
        ], [
            {type: 'integer', multipleOf: 2.1},
            2.1,
            true,
        ], [
            {type: 'number', multipleOf: 2.1},
            2.2,
            false,
        ], [
            {type: 'number', multipleOf: 2.1},
            4.2,
            true,
        ], [
            {type: 'number', multipleOf: 3},
            6,
            true,
        ], [
            {type: 'number', multipleOf: 3},
            9,
            true,
        ], [
            {type: 'number', multipleOf: 3},
            9.0001,
            false,
        ], [
            {type: 'number', multipleOf: 3},
            90000,
            true,
        ], [
            {type: 'number', multipleOf: 3},
            10.1,
            false,
        ], [
            {type: 'number', multipleOf: 0.1},
            0.1,
            true,
        ], [
            {type: 'number', multipleOf: 0.1},
            0.2,
            true,
        ], [
            {type: 'number', multipleOf: 0.1},
            0.3,
            true,
        ], [
            {type: 'number', multipleOf: 0.1},
            0.4,
            true,
        ], [
            {type: 'number', multipleOf: 0.1},
            0.5,
            true,
        ], [
            {type: 'number', multipleOf: 0.1},
            0.6,
            true,
        ], [
            {type: 'number', multipleOf: 0.1},
            0.7,
            true,
        ], [
            {type: 'number', multipleOf: 0.1},
            0.8,
            true,
        ], [
            {type: 'number', multipleOf: 0.1},
            0.9,
            true,
        ], [
            {type: 'number', multipleOf: 0.01},
            1,
            true,
        ], [
            {type: 'number', multipleOf: 0.01},
            0.01,
            true,
        ], [
            {type: 'number', multipleOf: 0.01},
            0.02,
            true,
        ], [
            {type: 'number', multipleOf: 0.01},
            0.03,
            true,
        ], [
            {type: 'number', multipleOf: 0.01},
            0.04,
            true,
        ], [
            {type: 'number', multipleOf: 0.01},
            0.05,
            true,
        ], [
            {type: 'number', multipleOf: 0.01},
            0.06,
            true,
        ], [
            {type: 'number', multipleOf: 0.01},
            0.07,
            true,
        ], [
            {type: 'number', multipleOf: 0.01},
            0.08,
            true,
        ], [
            {type: 'number', multipleOf: 0.01},
            0.09,
            true,
        ], [
            {type: 'number', multipleOf: 0.01},
            0.1,
            true,
        ], [
            {type: 'number', multipleOf: 0.01},
            0.11,
            true,
        ], [
            {type: 'number', multipleOf: 0.01},
            0.12,
            true,
        ], [
            {type: 'number', multipleOf: 0.01},
            0.025,
            false,
        ], [
            {type: 'number', multipleOf: 0.01},
            0.123,
            false,
        ], [
            {type: 'number', multipleOf: 0.0001},
            1033330.13,
            true,
        ], [
            {type: 'number', multipleOf: 0.0000001},
            1033330.1234654,
            // 1033330.0000001,
            true,
        ], [
            {type: 'number', multipleOf: 0.000000001},
            1033330.123465445,
            // 1033330.0000001,
            true,
        ], [
            {type: 'number', multipleOf: 0.0000001},
            1033330.00000015,
            false,
        ], [
            {type: 'number', multipleOf: 0.01},
            1033330.0001,
            false,
        ],
    ]
    test.each(validateMultipleOfTestValues)(
        'validateMultipleOf(%j, %j) : %s',
        (schema, value, expected) => {
            const orderedSchema = createOrderedMap(schema)
            expect(validateMultipleOf(orderedSchema, value)).toBe(expected)
        }
    )
})

describe('multipleOfValidator', () => {
    type multipleOfValidatorTest = [
        // schema:
        JsonSchemaNumber,
        // value:
        any,
        // error:
        List<any>,
        // expectedValid:
        boolean,
        // expectedError:
        boolean
    ]

    const multipleOfValidatorTestValues: multipleOfValidatorTest[] = [
        [
            {type: 'number', multipleOf: 2},
            2,
            List([ERROR_MULTIPLE_OF, Map({multipleOf: 2})]),
            true,
            false,
        ], [
            {type: 'number', multipleOf: 2},
            3,
            List([ERROR_MULTIPLE_OF, Map({multipleOf: 2})]),
            false,
            true,
        ],
    ]

    test.each(multipleOfValidatorTestValues)(
        '.handle(%j, %s)',
        (schema, value, error, expectedValid, expectedError) => {
            const result = multipleOfValidator.handle({
                schema: OrderedMap(schema),
                value,
                errors: createValidatorErrors(),
                valid: true,
            })
            expect(result.valid).toBe(expectedValid)
            expect(result.errors.hasError(error.get(0))).toBe(expectedError)
            if (result.errors.hasError(error.get(0))) {
                expect(result.errors.getError(error.get(0)).get(0)?.equals(error.get(1))).toBe(expectedError)
            }
        }
    )
})
