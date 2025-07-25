import { test, expect, describe } from '@jest/globals'
import {
    validateMultipleOf,
} from '@ui-schema/json-schema/Validators/MultipleOfValidator'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { UISchema, JsonSchemaNumber } from '@ui-schema/json-schema/Definitions'

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
        ],
        [
            {type: 'number', multipleOf: 2},
            3,
            false,
        ],
        [
            {type: 'number', multipleOf: 2},
            4,
            true,
        ],
        [
            {type: 'number', multipleOf: 2},
            -4,
            true,
        ],
        [
            {type: 'number', multipleOf: 2},
            0,
            true,
        ],
        [
            {type: 'number', multipleOf: 15},
            30,
            true,
        ],
        [
            {type: 'number', multipleOf: 150},
            300,
            true,
        ],
        [
            {type: 'number', multipleOf: 15000},
            300000,
            true,
        ],
        [
            {type: 'number', multipleOf: 15000000000},
            300000000000,
            true,
        ],
        [
            {type: 'number', multipleOf: 2},
            undefined,
            true,
        ],
        [
            {type: 'number'},
            undefined,
            true,
        ],
        [
            {type: 'integer', multipleOf: 2.1},
            2.1,
            true,
        ],
        [
            {type: 'number', multipleOf: 2.1},
            2.2,
            false,
        ],
        [
            {type: 'number', multipleOf: 2.1},
            4.2,
            true,
        ],
        [
            {type: 'number', multipleOf: 3},
            6,
            true,
        ],
        [
            {type: 'number', multipleOf: 3},
            9,
            true,
        ],
        [
            {type: 'number', multipleOf: 3},
            9.0001,
            false,
        ],
        [
            {type: 'number', multipleOf: 3},
            90000,
            true,
        ],
        [
            {type: 'number', multipleOf: 3},
            10.1,
            false,
        ],
        [
            {type: 'number', multipleOf: 0.1},
            0.1,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.1},
            0.2,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.1},
            0.3,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.1},
            0.4,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.1},
            0.5,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.1},
            0.6,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.1},
            0.7,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.1},
            0.8,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.1},
            0.9,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.01},
            1,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.01},
            0.01,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.01},
            0.02,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.01},
            0.03,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.01},
            0.04,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.01},
            0.05,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.01},
            0.06,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.01},
            0.07,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.01},
            0.08,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.01},
            0.09,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.01},
            0.1,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.01},
            0.11,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.01},
            0.12,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.01},
            0.025,
            false,
        ],
        [
            {type: 'number', multipleOf: 0.01},
            0.123,
            false,
        ],
        [
            {type: 'number', multipleOf: 0.0001},
            1033330.13,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.0000001},
            1033330.1234654,
            // 1033330.0000001,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.000000001},
            1033330.123465445,
            // 1033330.0000001,
            true,
        ],
        [
            {type: 'number', multipleOf: 0.0000001},
            1033330.00000015,
            false,
        ],
        [
            {type: 'number', multipleOf: 0.01},
            1033330.0001,
            false,
        ],
        [
            {type: 'number', multipleOf: 0},
            0,
            false,
        ],
        [
            {type: 'number', multipleOf: 0},
            1,
            false,
        ],
    ]
    test.each(validateMultipleOfTestValues)(
        'validateMultipleOf(%j, %j) : %s',
        (schema, value, expected) => {
            const orderedSchema = createOrderedMap(schema)
            expect(validateMultipleOf(orderedSchema.get('multipleOf'), value)).toBe(expected)
        },
    )
})

