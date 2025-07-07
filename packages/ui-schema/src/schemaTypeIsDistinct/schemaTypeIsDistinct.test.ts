import { expect, describe, test } from '@jest/globals'
import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { schemaTypeIsDistinct } from './schemaTypeIsDistinct.js'

/**
 * npm run tdd -- --testPathPattern=schemaTypeIsDistinct --selectProjects=test-@ui-schema/ui-schema
 */

describe('schemaTypeIsDistinct', () => {
    interface TestCase {
        type: SchemaTypesType
        expectedType: string
        ignoreTypes?: Set<string> | null
        expected: boolean
    }

    test.each<TestCase>([
        {
            type: 'null',
            expectedType: 'null',
            expected: true,
        },
        {
            type: ['null', 'string'],
            expectedType: 'null',
            expected: false,
        },
        {
            type: ['null', 'string'],
            expectedType: 'string',
            expected: true,
        },
        {
            type: ['null', 'string'],
            expectedType: 'string',
            ignoreTypes: null,
            expected: false,
        },
        {
            type: ['string'],
            expectedType: 'string',
            expected: true,
        },
        {
            type: 'string',
            expectedType: 'string',
            expected: true,
        },
        {
            type: ['string', 'number'],
            expectedType: 'string',
            expected: false,
        },
    ])(
        'schemaTypeIsDistinct - $type => $expected',
        async (
            {
                type,
                expectedType,
                ignoreTypes,
                expected,
            },
        ) => {
            expect(schemaTypeIsDistinct(type, expectedType, ignoreTypes)).toBe(expected)
        },
    )
})
