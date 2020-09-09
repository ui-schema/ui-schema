import { OrderedMap, List, Map } from "immutable"
import {
    validateMinMax, minMaxValidator, ERROR_MAX_LENGTH, ERROR_MIN_LENGTH,
} from '@ui-schema/ui-schema/Validators/MinMaxValidator'
import { createMap, createOrderedMap } from "@ui-schema/ui-schema/Utils"
import { JsonSchema } from "@ui-schema/ui-schema/JsonSchema"
import { UISchema } from "@ui-schema/ui-schema/UISchema"
import { createValidatorErrors } from "@ui-schema/ui-schema/ValidityReporter/ValidatorErrors"

describe('validateMinMax', () => {
    type validateMinMaxTest = [
        // schema:
            JsonSchema & UISchema,
        // value:
        any,
        // expected qty of errors:
        number
    ]
    const validateMinMaxTestValues: validateMinMaxTest[] = [
        [
            {type: 'string', minLength: 2},
            'te',
            0,
        ], [
            {type: 'string', minLength: 2},
            't',
            1,
        ], [
            {type: 'string', minLength: 1},
            '',
            1,
        ], [
            {type: 'string', maxLength: 2},
            'tex',
            1,
        ], [
            {type: 'string', maxLength: 2},
            'te',
            0,
        ], [
            {type: 'string', maxLength: 2},
            111,
            0,
        ], [
            {type: 'array', minItems: 2},
            ['text1'],
            1,
        ], [
            {type: 'array', minItems: 2},
            ['text1', 'text2'],
            0,
        ], [
            {type: 'array', minItems: 2},
            'not-an-array',
            0,
        ], [
            {type: 'array', maxItems: 2},
            'not-an-array',
            0,
        ], [
            {type: 'array', maxItems: 2},
            ['text1', 'text2'],
            0,
        ], [
            {type: 'array', maxItems: 2},
            ['text1', 'text2', 'text3'],
            1,
        ], [
            {type: 'array', minItems: 2},
            List(['text1']),
            1,
        ], [
            {type: 'array', minItems: 2},
            List(['text1', 'text2']),
            0,
        ], [
            {type: 'array', maxItems: 2},
            List(['text1', 'text2']),
            0,
        ], [
            {type: 'array', maxItems: 2},
            List(['text1', 'text2', 'text3']),
            1,
        ], [
            {type: 'object', minProperties: 2},
            {a: 'text1'},
            1,
        ], [
            {type: 'object', minProperties: 2},
            {a: 'text1', b: 'text2'},
            0,
        ], [
            {type: 'object', minProperties: 2},
            'not-an-object',
            0,
        ], [
            {type: 'object', maxProperties: 2},
            'not-an-object',
            0,
        ], [
            {type: 'object', maxProperties: 2},
            {a: 'text1', b: 'text2'},
            0,
        ], [
            {type: 'object', maxProperties: 2},
            {a: 'text1', b: 'text2', c: 'text3'},
            1,
        ], [
            {type: 'object', minProperties: 2},
            createMap({a: 'text1'}),
            1,
        ], [
            {type: 'object', minProperties: 2},
            createMap({a: 'text1', b: 'text2'}),
            0,
        ], [
            {type: 'object', maxProperties: 2},
            createMap({a: 'text1', b: 'text2'}),
            0,
        ], [
            {type: 'object', maxProperties: 2},
            createMap({a: 'text1', b: 'text2', c: 'text3'}),
            1,
        ], [
            {type: 'number', minimum: 2},
            1,
            1,
        ], [
            {type: 'number', minimum: 2},
            2,
            0,
        ], [
            {type: 'number', maximum: 2},
            2,
            0,
        ], [
            {type: 'number', maximum: 2},
            3,
            1,
        ], [
            {type: 'number', exclusiveMinimum: 2},
            2,
            1,
        ], [
            {type: 'number', exclusiveMinimum: 2},
            3,
            0,
        ], [
            {type: 'number', exclusiveMaximum: 2},
            1,
            0,
        ], [
            {type: 'number', exclusiveMaximum: 2},
            2,
            1,
        ], [
            {type: 'integer', minimum: 2},
            1,
            1,
        ], [
            {type: 'integer', minimum: 2},
            2,
            0,
        ], [
            {type: 'integer', maximum: 2},
            2,
            0,
        ], [
            {type: 'integer', maximum: 2},
            3,
            1,
        ], [
            {type: 'integer', exclusiveMinimum: 2},
            2,
            1,
        ], [
            {type: 'integer', exclusiveMinimum: 2},
            3,
            0,
        ], [
            {type: 'integer', exclusiveMaximum: 2},
            1,
            0,
        ], [
            {type: 'integer', exclusiveMaximum: 2},
            2,
            1,
        ], [
            // @ts-ignore draft-04 check
            {type: 'integer', exclusiveMinimum: true, minimum: 2},
            2,
            1,
        ], [
            // @ts-ignore draft-04 check
            {type: 'integer', exclusiveMinimum: true, minimum: 2},
            3,
            0,
        ], [
            // @ts-ignore draft-04 check
            {type: 'integer', exclusiveMaximum: true, maximum: 2},
            1,
            0,
        ], [
            // @ts-ignore draft-04 check
            {type: 'integer', exclusiveMaximum: true, maximum: 2},
            2,
            1,
        ], [
            {type: 'integer', maximum: 2},
            undefined,
            0,
        ],
    ]
    test.each(validateMinMaxTestValues)(
        'validateMinMax(%j, %j)',
        (schema, value, expected) => {
            const orderedSchema = createOrderedMap(schema)
            expect(validateMinMax(orderedSchema, value).errCount).toBe(expected)
        },
    )
})

describe('minMaxValidator', () => {
    type minMaxValidatorTest = [
        // schema:
            JsonSchema & UISchema,
        // value:
        any,
        // error:
        List<any>,
        // expectedValid:
        boolean,
        // expectedError:
        boolean
    ]

    const minMaxValidatorTestValues: minMaxValidatorTest[] = [
        [
            {type: 'string', maxLength: 2},
            'tt',
            List([ERROR_MAX_LENGTH, Map({max: 2})]),
            true,
            false,
        ], [
            {type: 'string', maxLength: 2},
            'ttt',
            List([ERROR_MAX_LENGTH, Map({max: 2})]),
            false,
            true,
        ], [
            {type: 'string', minLength: 2},
            'tt',
            List([ERROR_MIN_LENGTH, Map({min: 2})]),
            true,
            false,
        ], [
            {type: 'string', minLength: 2},
            't',
            List([ERROR_MIN_LENGTH, Map({min: 2})]),
            false,
            true,
        ],
    ]

    test.each(minMaxValidatorTestValues)(
        '.validate(%j, %s)',
        (schema, value, error, expectedValid, expectedError) => {
            const result = minMaxValidator.validate({
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
