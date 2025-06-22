import { expect, describe, test } from '@jest/globals'
import { moveItem } from '@ui-schema/ui-schema/Utils/moveItem'
import { List } from 'immutable'

describe('moveItem', () => {
    test.each([
        [{equals: () => 'no-list'}, 1, 0, '', 'no-list'],
        [List(['a', 'b']), 1, 0, List(['b', 'a']), true],
        [List(['b', 'a']), 0, 1, List(['a', 'b']), true],
        [List(['a', 'b']), 1, 0, List(['a', 'b']), false],
        [List(['a', 'b']), 2, 0, List(['a', 'b']), true],
        [List(['a', 'b']), 0, 2, List(['a', 'b']), true],
    ] as [List<any>, number, number, List<any>, boolean][])(
        'moveItem(%j, %s, %s)',
        (value, oldI, newI, expected, expectedCompare) => {
            expect(moveItem(value, oldI, newI).equals(expected)).toBe(expectedCompare)
        }
    )
})
