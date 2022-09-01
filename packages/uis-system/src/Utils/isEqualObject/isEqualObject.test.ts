import { isEqualObject } from '@ui-schema/system/Utils/isEqualObject'
import { createMap } from '@ui-schema/ui-schema/Utils/createMap'
import { List } from 'immutable'

describe('isEqualObject', () => {
    test.each([
        [{a: 'name'}, {a: 'name'}, true],
        [{a: 'name'}, {a: 'names'}, false],
        [{a: 'name'}, {b: 'name'}, false],
        [{a: createMap({c: 'name'})}, {a: createMap({c: 'name'})}, true],
        [{a: {c: 'name'}}, {a: createMap({c: 'name'})}, false],
        [{a: createMap({c: 'name'})}, {a: {c: 'name'}}, false],
        [{a: createMap({c: 'name'})}, {a: createMap({c: 'names'})}, false],
        [{a: createMap({c: 'name'})}, {a: createMap({b: 'name'})}, false],
        [{a: List(['name'])}, {a: List(['name'])}, true],
        [{a: ['name']}, {a: List(['name'])}, false],
        [{a: List(['name'])}, {a: ['name']}, false],
        [{a: List(['name'])}, {a: List(['names'])}, false],
        [{a: List(['name'])}, {a: List(['name', 'street'])}, false],
        [{a: List(['name']), b: true}, {a: List(['name']), b: true}, true],
        [{a: List(['name']), b: true}, {a: List(['name']), b: false}, false],
    ])(
        'isEqualObject(%j, %s)',
        (prevProps, nextProps, expectedValid) => {
            expect(isEqualObject(prevProps, nextProps)).toBe(expectedValid)
        }
    )
})
