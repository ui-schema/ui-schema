import { expect, describe, test } from '@jest/globals'
import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { List } from 'immutable'
import { schemaTypeToDistinct } from './schemaTypeToDistinct.js'

/**
 * npm run tdd -- --testPathPattern=schemaTypeToDistinct --selectProjects=test-@ui-schema/ui-schema
 */

describe('schemaTypeToDistinct', () => {
    interface TestCase {
        type: unknown | SchemaTypesType
        expected: string | undefined
    }

    test.each<TestCase>([
        {
            type: null,
            expected: undefined,
        },
        {
            type: undefined,
            expected: undefined,
        },
        {
            type: 123,
            expected: undefined,
        },
        {
            type: 'abc',
            expected: 'abc',// no validation that really a json-type
        },
        {
            type: 'string',
            expected: 'string',
        },
        {
            // if only `null` type exists, it is used
            type: ['null'],
            expected: 'null',
        },
        {
            type: ['string'],
            expected: 'string',
        },
        {
            // if only `null` and another type exist, the other types are used
            type: ['null', 'string'],
            expected: 'string',
        },
        {
            // multiple types are sorted by alphabetical order and joined with `+`
            type: ['string', 'number'],
            expected: 'number+string',
        },
        {
            type: ['number', 'string'],
            expected: 'number+string',
        },
        {
            type: ['null', 'string', 'number', 'boolean'],
            expected: 'boolean+number+string',
        },
        {
            type: List(['number']),
            expected: 'number',
        },
        {
            type: List(['number', 'string']),
            expected: 'number+string',
        },
        {
            type: List(['null', 'string']),
            expected: 'string',
        },
    ])(
        'schemaTypeToDistinct - $type => $expected',
        async (
            {
                type, expected,
            },
        ) => {
            expect(schemaTypeToDistinct(type)).toBe(expected)
        },
    )
})
