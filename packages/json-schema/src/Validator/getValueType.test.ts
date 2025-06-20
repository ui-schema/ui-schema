import { expect, describe, test } from '@jest/globals'
import { List, Map, OrderedMap, Record } from 'immutable'
import { getValueType } from './getValueType.js'

/**
 * npm run tdd -- --testPathPattern=Validator/getValueType.test.ts --selectProjects=test-@ui-schema/json-schema
 */

describe('getValueType', () => {
    test.each<{ value: unknown, expected: string | undefined }>([
        {
            value: 'lorem',
            expected: 'string',
        },
        {
            value: 1,
            expected: 'number',
        },
        {
            value: true,
            expected: 'boolean',
        },
        {
            value: {},
            expected: 'object',
        },
        {
            value: [],
            expected: 'array',
        },
        {
            value: Map({}),
            expected: 'object',
        },
        {
            value: OrderedMap({}),
            expected: 'object',
        },
        {
            value: Record({})({}),
            expected: 'object',
        },
        {
            value: List([]),
            expected: 'array',
        },
    ])(
        'getValueType($value): $expected',
        ({value, expected}) => {
            expect(getValueType(value)).toStrictEqual(expected)
        },
    )
})
