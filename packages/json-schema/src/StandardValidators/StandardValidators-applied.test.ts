import { expect, describe, test } from '@jest/globals'
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { createOrdered } from '@ui-schema/system/createMap'
import { Validator } from '@ui-schema/json-schema/Validator'
import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'

/**
 * npm run tdd -- --testPathPattern=StandardValidators/StandardValidators-applied.test.ts --selectProjects=test-@ui-schema/json-schema
 */

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const mocksFolder = path.join(__dirname, '../../', 'tests/mocks')

const readSchema = (filename: string) => {
    return fs.readFile(path.join(mocksFolder, filename)).then(b => JSON.parse(b.toString()))
}

describe('StandardValidators-applied', () => {
    const validator = Validator(standardValidators)
    test.each<({ schema: any } | { file: string }) & { value: unknown, applied: any }>([
        {
            schema: {
                type: 'string',
            },
            value: 'lorem',
            applied: [],
        },
        {
            schema: {
                type: 'string',
                if: {
                    maxLength: 5,
                },
                then: {
                    pattern: '^[A-Z]+$',
                },
                else: {
                    pattern: '^[A-Z0-9]+$',
                },
            },
            value: 'LOREM',
            applied: [
                {
                    pattern: '^[A-Z]+$',
                },
            ],
        },
        {
            schema: {
                type: 'string',
                allOf: [
                    {
                        maxLength: 5,
                    },
                    {
                        pattern: '^[A-Z]+$',
                    },
                ],
            },
            value: 'LOREM',
            applied: [
                {
                    maxLength: 5,
                },
                {
                    pattern: '^[A-Z]+$',
                },
            ],
        },
        {
            schema: {
                type: 'string',
                allOf: [
                    {
                        if: {
                            maxLength: 5,
                        },
                        then: {
                            pattern: '^[A-Z]+$',
                        },
                        else: {
                            pattern: '^[A-Z0-9]+$',
                        },
                    },
                    {
                        maxLength: 10,
                    },
                ],
            },
            value: 'LOREM',
            applied: [
                {
                    if: {
                        maxLength: 5,
                    },
                    then: {
                        pattern: '^[A-Z]+$',
                    },
                    else: {
                        pattern: '^[A-Z0-9]+$',
                    },
                },
                {
                    maxLength: 10,
                },
                {
                    pattern: '^[A-Z]+$',
                },
            ],
        },
        {
            schema: {
                type: 'string',
                allOf: [
                    {
                        if: {
                            maxLength: 5,
                        },
                        then: {
                            pattern: '^[A-Z]+$',
                        },
                        else: {
                            pattern: '^[A-Z0-9]+$',
                        },
                    },
                    {
                        maxLength: 10,
                    },
                ],
            },
            value: 'LOREM012X',
            applied: [
                {
                    if: {
                        maxLength: 5,
                    },
                    then: {
                        pattern: '^[A-Z]+$',
                    },
                    else: {
                        pattern: '^[A-Z0-9]+$',
                    },
                },
                {
                    maxLength: 10,
                },
                {
                    pattern: '^[A-Z0-9]+$',
                },
            ],
        },
    ])(
        '$# validator($schema, $value): $applied',
        async ({value, applied, ...params}) => {
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
            // console.log('res.applied', res.applied?.map(s => s.toJS()))
            expect(res.valid).toBe(true)
            expect(res.applied?.map(s => s.toJS())).toStrictEqual(applied)
        },
    )
})
