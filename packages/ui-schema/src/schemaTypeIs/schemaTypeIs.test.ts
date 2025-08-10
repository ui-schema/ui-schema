import { expect, describe, test } from '@jest/globals'
import { schemaTypeIs, schemaTypeIsAny, schemaTypeIsNumeric } from '@ui-schema/ui-schema/schemaTypeIs'
import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { List } from 'immutable'

/**
 * npm run tdd -- --testPathPattern=schemaTypeIs --selectProjects=test-@ui-schema/ui-schema
 */

describe('schemaTypeIs', () => {
    interface TestCase {
        type: SchemaTypesType
        expectedType: string
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
            expected: true,
        },
        {
            type: ['null', 'string'],
            expectedType: 'string',
            expected: true,
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
            expected: true,
        },
        {
            type: ['number'],
            expectedType: 'number',
            expected: true,
        },
    ])(
        'schemaTypeIs - $type => $expected',
        async (
            {
                type,
                expectedType,
                expected,
            },
        ) => {
            expect(schemaTypeIs(type, expectedType)).toBe(expected)
        },
    )

    test.each<{ type: SchemaTypesType, expected: boolean }>([
        {
            type: ['string'],
            expected: false,
        },
        {
            type: 'string',
            expected: false,
        },
        {
            type: ['string', 'number'],
            expected: true,
        },
        {
            type: ['number'],
            expected: true,
        },
        {
            type: 'number',
            expected: true,
        },
        {
            type: 'integer',
            expected: true,
        },
    ])(
        'schemaTypeIsNumeric - $type => $expected',
        async (
            {
                type,
                expected,
            },
        ) => {
            expect(schemaTypeIsNumeric(type)).toBe(expected)
        },
    )

    test.each<{ type: SchemaTypesType, expectedTypes: string[], expected: boolean }>([
        {
            type: 'string',
            expectedTypes: ['string', 'number'],
            expected: true,
        },
        {
            type: 'number',
            expectedTypes: ['string', 'number'],
            expected: true,
        },
        {
            type: 'integer',
            expectedTypes: ['string', 'number'],
            expected: false,
        },
        {
            type: ['string', 'number'],
            expectedTypes: ['string'],
            expected: true,
        },
        {
            type: ['string', 'number'],
            expectedTypes: ['integer'],
            expected: false,
        },
        {
            type: ['string', 'number'],
            expectedTypes: ['string', 'integer'],
            expected: true,
        },
        {
            type: ['string', 'array'],
            expectedTypes: ['string', 'integer'],
            expected: true,
        },
        {
            type: 'boolean',
            expectedTypes: ['string', 'number'],
            expected: false,
        },
        {
            type: List(['string', 'array']),
            expectedTypes: ['string', 'integer'],
            expected: true,
        },
        {
            type: List(['string', 'array']),
            expectedTypes: ['integer'],
            expected: false,
        },
        {
            type: undefined,
            expectedTypes: ['string', 'number'],
            expected: false,
        },
        {
            type: null as any,
            expectedTypes: ['string', 'number'],
            expected: false,
        },
    ])(
        'schemaTypeIsAny - type: $type, expectedTypes: $expectedTypes => $expected',
        async (
            {
                type,
                expectedTypes,
                expected,
            },
        ) => {
            expect(schemaTypeIsAny(type, expectedTypes)).toBe(expected)
        },
    )
})
