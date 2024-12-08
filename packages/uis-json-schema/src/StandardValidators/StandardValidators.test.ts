import { expect, describe, test } from '@jest/globals'
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { createOrdered } from '@ui-schema/system/createMap'
import { Validator } from '@ui-schema/json-schema/Validator'
import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'

/**
 * npm run tdd -- --testPathPattern=StandardValidators/StandardValidators.test.ts --selectProjects=test-@ui-schema/json-schema
 */

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const mocksFolder = path.join(__dirname, '../../', 'tests/mocks')

const readSchema = (filename: string) => {
    return fs.readFile(path.join(mocksFolder, filename)).then(b => JSON.parse(b.toString()))
}

describe('StandardValidators', () => {
    // basic integration test for standardValidators
    // todo: expand with a bigger test suite
    const validator = Validator(standardValidators)
    test.each<({ schema: any } | { file: string }) & { value: unknown, expected: { valid: boolean } }>([
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
        {
            file: 'dependencies-dependent-required.json',
            value: {
                'name': 'John Doe',
                'credit_card': 5555555555555555,
                'billing_address': '555 Debtor\'s Lane',
            },
            expected: {valid: true},
        },
        {
            file: 'dependencies-dependent-required.json',
            value: {
                'name': 'John Doe',
                'credit_card': 5555555555555555,
            },
            expected: {valid: false},
        },
        {
            file: 'dependencies-dependent-schemas.json',
            value: {
                'name': 'John Doe',
                'credit_card': 5555555555555555,
                'billing_address': '555 Debtor\'s Lane',
            },
            expected: {valid: true},
        },
        {
            file: 'dependencies-dependent-schemas.json',
            value: {
                'name': 'John Doe',
                'credit_card': 5555555555555555,
            },
            expected: {valid: false},
        },
        {
            file: 'dependencies-required.json',
            value: {
                'name': 'John Doe',
                'credit_card': 5555555555555555,
                'billing_address': '555 Debtor\'s Lane',
            },
            expected: {valid: true},
        },
        {
            file: 'dependencies-required.json',
            value: {
                'name': 'John Doe',
                'credit_card': 5555555555555555,
            },
            expected: {valid: false},
        },
        {
            file: 'dependencies-schemas.json',
            value: {
                'name': 'John Doe',
                'credit_card': 5555555555555555,
                'billing_address': '555 Debtor\'s Lane',
            },
            expected: {valid: true},
        },
        {
            file: 'dependencies-schemas.json',
            value: {
                'name': 'John Doe',
                'credit_card': 5555555555555555,
            },
            expected: {valid: false},
        },
        {
            schema: {
                'allOf': [
                    {'properties': {'name': {'type': 'string'}}, 'unevaluatedProperties': false},
                    {'properties': {'price': {'type': 'number'}}},
                ],
                'unevaluatedProperties': false,
            },
            value: {'name': 'A'},
            expected: {valid: true},
        },
        {
            schema: {
                'allOf': [
                    {'properties': {'name': {'type': 'string'}}, 'unevaluatedProperties': false},
                    {'properties': {'price': {'type': 'number'}}},
                ],
                'unevaluatedProperties': false,
            },
            value: {'name': 'A', 'price': 123},
            expected: {valid: false},
        },
        {
            schema: {
                'properties': {
                    'name': {'type': 'string'},
                    'price': {'type': 'number'},
                },
                'unevaluatedProperties': false,
            },
            value: {'name': 'A', 'price': 123},
            expected: {valid: true},
        },
        {
            schema: {
                'properties': {
                    'name': {'type': 'string'},
                    'price': {'type': 'number'},
                },
                'unevaluatedProperties': false,
            },
            value: {'name': 'A', 'price': 123, 'x': true},
            expected: {valid: false},
        },
    ])(
        '$# validator($schema, $value): $expected',
        async ({value, expected, ...params}) => {
            let schema
            if ('schema' in params) {
                schema = createOrdered(params.schema)
            } else {
                schema = createOrdered(await readSchema(params.file))
            }
            const res = validator.validate(
                schema,
                typeof value === 'object' && value ? createOrdered(value) : value,
            )
            expect(res.valid).toStrictEqual(expected.valid)
        },
    )
})
