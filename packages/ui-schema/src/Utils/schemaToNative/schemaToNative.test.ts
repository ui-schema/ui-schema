import { mapSchema } from "@ui-schema/ui-schema/Utils/schemaToNative/schemaToNative"
import { Map } from "immutable"
import { createMap } from "@ui-schema/ui-schema/Utils"

describe('mapSchema', () => {
    test.each([
        [{}, createMap({minLength: 10}), (res: { [key: string]: any }) => (res.minLength === 10), true],
        [{}, createMap({maxLength: 5}), (res: { [key: string]: any }) => (res.maxLength === 5), true],
        [{}, createMap({minimum: 1}), (res: { [key: string]: any }) => (res.min === 1), true],
        [{}, createMap({maximum: 2}), (res: { [key: string]: any }) => (res.max === 2), true],
        [{}, createMap({multipleOf: 4}), (res: { [key: string]: any }) => (res.step === 4), true],
        [{}, createMap({pattern: '*'}), (res: { [key: string]: any }) => (res.pattern === '*'), true],
        [{}, createMap({}), (res: { [key: string]: any }) => (Object.keys(res).length === 0), true],
    ] as [{}, Map<any, undefined>, Function, boolean][])(
        'mapSchema(%j, %j)',
        (inputProps, schema, compare, expected) => {
            expect(compare(mapSchema(inputProps, schema))).toBe(expected)
        }
    )
})
