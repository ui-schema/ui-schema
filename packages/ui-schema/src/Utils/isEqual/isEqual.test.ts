import { isEqual } from '@ui-schema/ui-schema/Utils/isEqual'
import { List, Map } from 'immutable'

describe('isEqual', () => {
    test.each([
        ['name', 'name', true],
        [0, 0, true],
        [0, 1, false],
        [false, false, true],
        [false, true, false],
        [true, true, true],
        [true, false, false],
        [null, null, true],
        [undefined, undefined, true],
        ['name', 'names', false],
        ['0', 0, false],
        [0, false, false],
        [Map({a: 'name'}), Map({a: 'name'}), true],
        [Map({a: 'name1'}), Map({a: 'name'}), false],
        [List(['name']), List(['name']), true],
        [List(['name1']), List(['name']), false],
    ])(
        'isEqual(%j, %s)',
        (a: any, b: any, expectedValid) => {
            expect(isEqual(a, b)).toBe(expectedValid)
        }
    )
})
