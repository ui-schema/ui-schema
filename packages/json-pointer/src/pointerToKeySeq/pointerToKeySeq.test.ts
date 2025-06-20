import { expect, describe, test } from '@jest/globals'
import { List } from 'immutable'
import { pointerToKeySeq } from './pointerToKeySeq.js'
import { testCases } from '../JSONPointer.mock.js'

describe('JSONPointer', () => {
    test.each(testCases)(
        'pointerToKeySeq($keys) $pointer',
        (testData) => {
            const keySeq = pointerToKeySeq(testData.pointer)
            expect(keySeq.equals(List(testData.keys))).toBe(true)
        },
    )
})
