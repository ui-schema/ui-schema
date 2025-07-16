import { expect, describe, test } from '@jest/globals'
import { keysToName } from '@ui-schema/ui-schema/Utils/keysToName'
import { List } from 'immutable'

describe('keysToName', () => {
    test.each(([
        [
            List([]),
            '__root', // empty name is not ok, but mostly the root won't be an input
        ],
        [
            List(['profile']),
            'profile',
        ],
        [
            ['profile'],
            'profile',
        ],
        [
            List(['profile', 0]),
            'profile[0]',
        ],
        [
            ['profile', 0],
            'profile[0]',
        ],
        [
            ['profile', 'address', 'street'],
            'profile[address][street]',
        ],
        [
            ['xz_[]'],
            'xz_%5B%5D', // url encoded, to prevent invalid HTML
        ],
        [
            ['abc', 'xz_[]'],
            'abc[xz_%5B%5D]', // url encoded, to prevent invalid HTML
        ],
    ] as [List<any> | any[], string][]))(
        'keysToName(%j, %s)',
        (keys, expected) => {
            expect(keysToName(keys)).toBe(expected)
        },
    )
})
