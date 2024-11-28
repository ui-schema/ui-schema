import { expect, describe, test } from '@jest/globals'
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { createOrdered } from '@ui-schema/system/createMap'
import { Validator } from '@ui-schema/json-schema/Validator'

/**
 * npm run tdd -- --testPathPattern=StandardValidators/StandardValidators.test.ts --selectProjects=test-@ui-schema/json-schema
 */

describe('StandardValidators', () => {
    // basic integration test for standardValidators
    // todo: expand with a bigger test suite
    const validator = Validator(standardValidators)
    test.each<{ schema: any, value: unknown, expected: { valid: boolean } }>([
        {
            schema: {
                type: 'string',
            },
            value: 'lorem',
            expected: {valid: true},
        },
        {
            schema: {
                type: 'string',
            },
            value: 1,
            expected: {valid: false},
        },
        {
            schema: {
                type: 'number',
            },
            value: 1,
            expected: {valid: true},
        },
        {
            schema: {
                type: 'number',
            },
            value: 'lorem',
            expected: {valid: false},
        },
        {
            schema: {
                minLength: 2,
            },
            value: 'Lorem',
            expected: {valid: true},
        },
        {
            schema: {
                minLength: 2,
            },
            value: 'L',
            expected: {valid: false},
        },
        {
            schema: {
                minimum: 2,
            },
            value: 2,
            expected: {valid: true},
        },
        {
            schema: {
                minimum: 2,
            },
            value: 1,
            expected: {valid: false},
        },
        {
            schema: {
                not: {
                    type: 'string',
                },
            },
            value: 'lorem',
            expected: {valid: false},
        },
        {
            schema: {
                not: {
                    type: 'string',
                },
            },
            value: 1,
            expected: {valid: true},
        },
    ])(
        '$# validator($schema, $value): $expected',
        ({schema, value, expected}) => {
            const res = validator.validate(
                createOrdered(schema),
                value,
            )
            expect(res.valid).toStrictEqual(expected.valid)
        },
    )
})
