import { expect, describe, test } from '@jest/globals'
import { schemaRulesToNative } from '@ui-schema/json-schema/schemaRulesToNative'
import { Map } from 'immutable'
import { createMap } from '@ui-schema/system/createMap'

describe('schemaRulesToNative', () => {
    test.each([
        [{}, createMap({minLength: 10}), (res: { [key: string]: any }) => (res.minLength === 10), true],
        [{}, createMap({maxLength: 5}), (res: { [key: string]: any }) => (res.maxLength === 5), true],
        [{}, createMap({minimum: 1}), (res: { [key: string]: any }) => (res.min === 1), true],
        [{}, createMap({maximum: 2}), (res: { [key: string]: any }) => (res.max === 2), true],
        [{}, createMap({multipleOf: 4}), (res: { [key: string]: any }) => (res.step === 4), true],
        [{}, createMap({pattern: '*'}), (res: { [key: string]: any }) => (res.pattern === '*'), true],
        [{}, createMap({}), (res: { [key: string]: any }) => (Object.keys(res).length === 0), true],
    ] as [{}, Map<any, undefined>, Function, boolean][])(
        'schemaRulesToNative(%j, %j)',
        (inputProps, schema, compare, expected) => {
            expect(compare(schemaRulesToNative(inputProps, schema))).toBe(expected)
        },
    )
})
