import { OrderedMap, List, Map } from "immutable"
import {
    validateMultipleOf, multipleOfValidator, ERROR_MULTIPLE_OF,
} from '@ui-schema/ui-schema/Validators/MultipleOfValidator'
import { createOrderedMap } from "@ui-schema/ui-schema/Utils"
import { Schemas } from "@ui-schema/ui-schema/JsonSchema"
import { createValidatorErrors } from "@ui-schema/ui-schema/ValidityReporter/ValidatorErrors"

describe('validateMultipleOf', () => {
    type validateMultipleOfTest = [
        // schema:
        Schemas['number'],
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
        ],
    ]
    test.each(validateMultipleOfTestValues)(
        'validateMultipleOf(%j, %j) : %s',
        (schema, value, expected) => {
            const orderedSchema = createOrderedMap(schema)
            expect(validateMultipleOf(orderedSchema, value)).toBe(expected)
        },
    )
})

describe('multipleOfValidator', () => {
    type multipleOfValidatorTest = [
        // schema:
        Schemas['number'],
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
        '.validate(%j, %s)',
        (schema, value, error, expectedValid, expectedError) => {
            const result = multipleOfValidator.validate({
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
        },
    )
})
