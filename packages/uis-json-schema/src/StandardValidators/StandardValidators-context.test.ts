import { expect, describe, test } from '@jest/globals'
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { createOrdered } from '@ui-schema/system/createMap'
import { makeParams, Validator } from '@ui-schema/json-schema/Validator'
import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'

/**
 * npm run tdd -- --testPathPattern=StandardValidators/StandardValidators-context.test.ts --selectProjects=test-@ui-schema/json-schema
 */

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const mocksFolder = path.join(__dirname, '../../', 'tests/mocks')

const readSchema = (filename: string) => {
    return fs.readFile(path.join(mocksFolder, filename)).then(b => JSON.parse(b.toString()))
}

describe('StandardValidators-context', () => {
    const validator = Validator(standardValidators)
    test.each<({ schema: any } | { file: string }) & { value: unknown, context: any }>([
        {
            schema: {
                type: 'string',
            },
            value: 'lorem',
            context: {},
        },
    ])(
        '$# validator($schema, $value): $context',
        async ({value, context, ...params}) => {
            let schema
            if ('schema' in params) {
                schema = createOrdered(params.schema)
            } else {
                schema = createOrdered(await readSchema(params.file))
            }
            const validateContext = {}
            validator.validate(
                schema,
                typeof value === 'object' && value ? createOrdered(value) : value,
                {
                    ...makeParams(),
                    context: validateContext,
                },
            )
            expect(validateContext).toStrictEqual(context)
        },
    )
})
