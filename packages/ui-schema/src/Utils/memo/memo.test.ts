import { isEqual } from "@ui-schema/ui-schema/Utils/memo/memo"
import { createMap } from "@ui-schema/ui-schema/Utils"
import { List } from "immutable"

describe('isEqual', () => {
    test.each([
        [{a: 'name'}, {a: 'name'}, true],
        [{a: 'name'}, {a: 'names'}, false],
        [{a: 'name'}, {b: 'name'}, false],
        [{a: createMap({c: 'name'})}, {a: createMap({c: 'name'})}, true],
        [{a: createMap({c: 'name'})}, {a: createMap({c: 'names'})}, false],
        [{a: createMap({c: 'name'})}, {a: createMap({b: 'name'})}, false],
        [{a: List(['name'])}, {a: List(['name'])}, true],
        [{a: List(['name'])}, {a: List(['names'])}, false],
        [{a: List(['name'])}, {a: List(['name', 'street'])}, false],
        [{a: List(['name']), b: true}, {a: List(['name']), b: true}, true],
        [{a: List(['name']), b: true}, {a: List(['name']), b: false}, false],
    ])(
        'isEqual(%j, %s)',
        (prevProps, nextProps, expectedValid) => {
            expect(isEqual(prevProps, nextProps)).toBe(expectedValid)
        },
    )
})
