import { expect, describe, test } from '@jest/globals'
import { List } from 'immutable'
import { testCases } from '../JSONPointer.mock.js'
import { toPointer } from './toPointer.js'

describe('toPointer', () => {
    test.each(testCases.filter(t => t.pointer !== '/'))(
        'toPointer($keys): $pointer (immutable)',
        ({pointer, keys}) => {
            expect(toPointer(List(keys))).toBe(pointer)
        },
    )

    test.each(testCases.filter(t => t.pointer !== '/'))(
        'toPointer($keys): $pointer (native-JS)',
        ({pointer, keys}) => {
            expect(toPointer(keys)).toBe(pointer)
        },
    )

    test.each([
        {
            pointer: '/oneOf/0',
            keys: ['oneOf', 0],
        },
        {
            pointer: '/oneOf/0',
            keys: List(['oneOf', 0]),
        },
    ])(
        'toPointer($keys): $pointer (with numbers)',
        ({pointer, keys}) => {
            expect(toPointer(keys)).toBe(pointer)
        },
    )
})
