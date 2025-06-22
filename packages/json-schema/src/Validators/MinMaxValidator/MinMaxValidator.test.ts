import { test, expect, describe } from '@jest/globals'
import { ValidatorOutput } from '@ui-schema/ui-schema/ValidatorOutput'
import { List } from 'immutable'
import { validateMinMaxArray, validateMinMaxNumber, validateMinMaxObject, validateMinMaxString } from '@ui-schema/json-schema/Validators/MinMaxValidator'
import { createMap, createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { UISchema, JsonSchemaPure } from '@ui-schema/json-schema/Definitions'

describe('validateMinMax', () => {
    type validateMinMaxTest = [
        // schema:
            JsonSchemaPure & UISchema,
        // value:
        any,
        // expected qty of errors:
        number
    ]
    const validateMinMaxTestString: validateMinMaxTest[] = [
        [
            {minLength: 2},
            'te',
            0,
        ],
        [
            {minLength: 2},
            't',
            1,
        ],
        [
            {minLength: 1},
            '',
            1,
        ],
        [
            {maxLength: 2},
            'te',
            0,
        ],
        [
            {maxLength: 2},
            'tex',
            // todo: add test for "is-correct-error"
            1,
        ],
        [
            {maxLength: 2},
            'te',
            0,
        ],
    ]

    const validateMinMaxTestArray: validateMinMaxTest[] = [
        [
            {minItems: 2},
            // todo: add test for "is-correct-error"
            ['text1'],
            1,
        ],
        [
            {minItems: 2},
            ['text1', 'text2'],
            0,
        ],
        [
            {maxItems: 2},
            ['text1', 'text2'],
            0,
        ],
        [
            {maxItems: 2},
            ['text1', 'text2', 'text3'],
            1,
        ],
        [
            {minItems: 2},
            List(['text1']),
            1,
        ],
        [
            {minItems: 2},
            List(['text1', 'text2']),
            0,
        ],
        [
            {maxItems: 2},
            List(['text1', 'text2']),
            0,
        ],
        [
            {maxItems: 2},
            List(['text1', 'text2', 'text3']),
            1,
        ],
    ]

    const validateMinMaxTestObject: validateMinMaxTest[] = [
        [
            {minProperties: 2},
            {a: 'text1'},
            1,
        ],
        [
            {minProperties: 2},
            {a: 'text1', b: 'text2'},
            0,
        ],
        [
            {maxProperties: 2},
            {a: 'text1', b: 'text2'},
            0,
        ],
        [
            {maxProperties: 2},
            {a: 'text1', b: 'text2', c: 'text3'},
            1,
        ],
        [
            {minProperties: 2},
            createMap({a: 'text1'}),
            1,
        ],
        [
            {minProperties: 2},
            createMap({a: 'text1', b: 'text2'}),
            0,
        ],
        [
            {maxProperties: 2},
            createMap({a: 'text1', b: 'text2'}),
            0,
        ],
        [
            {maxProperties: 2},
            createMap({a: 'text1', b: 'text2', c: 'text3'}),
            1,
        ],
    ]

    const validateMinMaxTestNumber: validateMinMaxTest[] = [
        [
            {minimum: 2},
            1,
            1,
        ],
        [
            {minimum: 2},
            2,
            0,
        ],
        [
            {maximum: 2},
            2,
            0,
        ],
        [
            {maximum: 2},
            3,
            1,
        ],
        [
            {exclusiveMinimum: 2},
            2,
            1,
        ],
        [
            {exclusiveMinimum: 2},
            3,
            0,
        ],
        [
            {exclusiveMaximum: 2},
            1,
            0,
        ],
        [
            {exclusiveMaximum: 2},
            2,
            1,
        ],
        [
            {minimum: 2},
            1,
            1,
        ],
        [
            {minimum: 2},
            2,
            0,
        ],
        [
            {maximum: 2},
            2,
            0,
        ],
        [
            {maximum: 2},
            3,
            1,
        ],
        [
            {exclusiveMinimum: 2},
            2,
            1,
        ],
        [
            {exclusiveMinimum: 2},
            3,
            0,
        ],
        [
            {exclusiveMaximum: 2},
            1,
            0,
        ],
        [
            {exclusiveMaximum: 2},
            2,
            1,
        ],
        [
            // draft-04 check
            {exclusiveMinimum: true, minimum: 2},
            2,
            1,
        ],
        [
            // draft-04 check
            {exclusiveMinimum: true, minimum: 2},
            3,
            0,
        ],
        [
            // draft-04 check
            {exclusiveMaximum: true, maximum: 2},
            1,
            0,
        ],
        [
            // draft-04 check
            {exclusiveMaximum: true, maximum: 2},
            2,
            1,
        ],
        [
            {maximum: 2},
            undefined,
            0,
        ],
    ]

    test.each(validateMinMaxTestString)(
        'validateMinMaxString(%j, %j)',
        (schema, value, expected) => {
            const orderedSchema = createOrderedMap(schema)
            const output = new ValidatorOutput()
            validateMinMaxString(orderedSchema, value, output)
            expect(output.errCount).toBe(expected)
        },
    )

    test.each(validateMinMaxTestNumber)(
        'validateMinMaxNumber(%j, %j)',
        (schema, value, expected) => {
            const orderedSchema = createOrderedMap(schema)
            const output = new ValidatorOutput()
            validateMinMaxNumber(orderedSchema, value, output)
            expect(output.errCount).toBe(expected)
        },
    )

    test.each(validateMinMaxTestArray)(
        'validateMinMaxArray(%j, %j)',
        (schema, value, expected) => {
            const orderedSchema = createOrderedMap(schema)
            const output = new ValidatorOutput()
            validateMinMaxArray(orderedSchema, value, output)
            expect(output.errCount).toBe(expected)
        },
    )

    test.each(validateMinMaxTestObject)(
        'validateMinMaxObject(%j, %j)',
        (schema, value, expected) => {
            const orderedSchema = createOrderedMap(schema)
            const output = new ValidatorOutput()
            validateMinMaxObject(orderedSchema, value, output)
            expect(output.errCount).toBe(expected)
        },
    )
})
