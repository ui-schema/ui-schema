import { OrderedMap, List, Map } from "immutable"
import {
    validateMinMax, minMaxValidator, ERROR_MAX_LENGTH, ERROR_MIN_LENGTH,
} from '@ui-schema/ui-schema/Validators/MinMaxValidator'
import { createMap, createOrderedMap } from "@ui-schema/ui-schema/Utils"
import { JsonSchema } from "@ui-schema/ui-schema/JsonSchema"

describe('validateMinMax', () => {
    type validateMinMaxTest = [
        // schema:
        JsonSchema,
        // value:
        any,
        // strict:
        boolean,
        // expected qty of errors:
        number
    ]
    const validateMinMaxTestValues: validateMinMaxTest[] = [
        [
            {type: 'string', minLength: 2},
            'text1',
            true,
            0,
        ], [
            {type: 'string', minLength: 2},
            't',
            true,
            1,
        ], [
            // todo: this test should expect `1` error for json-schema conformity
            {type: 'string', minLength: 1},
            '',
            false, // not required
            0,
        ], [
            // this test already expects `1` error for json-schema conformity
            {type: 'string', minLength: 1},
            '',
            true, // required
            1,
        ], [
            {type: 'string', maxLength: 2},
            'text1',
            true,
            1,
        ], [
            {type: 'string', maxLength: 2},
            't',
            true,
            0,
        ], [
            {type: 'array', minItems: 2},
            ['text1'],
            true,
            1,
        ], [
            {type: 'array', minItems: 2},
            ['text1', 'text2'],
            true,
            0,
        ], [
            {type: 'array', maxItems: 2},
            ['text1', 'text2'],
            true,
            0,
        ], [
            {type: 'array', maxItems: 2},
            ['text1', 'text2', 'text3'],
            true,
            1,
        ], [
            {type: 'array', minItems: 2},
            List(['text1']),
            true,
            1,
        ], [
            {type: 'array', minItems: 2},
            List(['text1', 'text2']),
            true,
            0,
        ], [
            {type: 'array', maxItems: 2},
            List(['text1', 'text2']),
            true,
            0,
        ], [
            {type: 'array', maxItems: 2},
            List(['text1', 'text2', 'text3']),
            true,
            1,
        ], [
            {type: 'object', minProperties: 2},
            {a: 'text1'},
            true,
            1,
        ], [
            {type: 'object', minProperties: 2},
            {a: 'text1', b: 'text2'},
            true,
            0,
        ], [
            {type: 'object', maxProperties: 2},
            {a: 'text1', b: 'text2'},
            true,
            0,
        ], [
            {type: 'object', maxProperties: 2},
            {a: 'text1', b: 'text2', c: 'text3'},
            true,
            1,
        ], [
            {type: 'object', minProperties: 2},
            createMap({a: 'text1'}),
            true,
            1,
        ], [
            {type: 'object', minProperties: 2},
            createMap({a: 'text1', b: 'text2'}),
            true,
            0,
        ], [
            {type: 'object', maxProperties: 2},
            createMap({a: 'text1', b: 'text2'}),
            true,
            0,
        ], [
            {type: 'object', maxProperties: 2},
            createMap({a: 'text1', b: 'text2', c: 'text3'}),
            true,
            1,
        ], [
            {type: 'number', minimum: 2},
            1,
            true,
            1,
        ], [
            {type: 'number', minimum: 2},
            2,
            true,
            0,
        ], [
            {type: 'number', maximum: 2},
            2,
            true,
            0,
        ], [
            {type: 'number', maximum: 2},
            3,
            true,
            1,
        ], [
            {type: 'number', exclusiveMinimum: 2},
            2,
            true,
            1,
        ], [
            {type: 'number', exclusiveMinimum: 2},
            3,
            true,
            0,
        ], [
            {type: 'number', exclusiveMaximum: 2},
            1,
            true,
            0,
        ], [
            {type: 'number', exclusiveMaximum: 2},
            2,
            true,
            1,
        ], [
            {type: 'integer', minimum: 2},
            1,
            true,
            1,
        ], [
            {type: 'integer', minimum: 2},
            2,
            true,
            0,
        ], [
            {type: 'integer', maximum: 2},
            2,
            true,
            0,
        ], [
            {type: 'integer', maximum: 2},
            3,
            true,
            1,
        ], [
            {type: 'integer', exclusiveMinimum: 2},
            2,
            true,
            1,
        ], [
            {type: 'integer', exclusiveMinimum: 2},
            3,
            true,
            0,
        ], [
            {type: 'integer', exclusiveMaximum: 2},
            1,
            true,
            0,
        ], [
            {type: 'integer', exclusiveMaximum: 2},
            2,
            true,
            1,
        ],
    ]
    test.each(validateMinMaxTestValues)(
        'validateMinMax(%j, %j)',
        (schema, value, strict, expected) => {
            const orderedSchema = createOrderedMap(schema)
            expect(validateMinMax(orderedSchema, value, strict).size).toBe(expected)
        },
    )
})

describe('minMaxValidator', () => {
    type minMaxValidatorTest = [
        // schema:
        JsonSchema,
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
                required: true,
                schema: OrderedMap(schema),
                value,
                errors: List([]),
                valid: true,
            })
            expect(result.valid).toBe(expectedValid)
            expect(result.errors.contains(error)).toBe(expectedError)
        },
    )
})
