import { expect, describe, test } from '@jest/globals'
import { pointerToKeySeq } from './pointerToKeySeq.js'
import { testCases } from '../JSONPointer.mock.js'

describe('JSONPointer', () => {
    test.each(testCases)(
        'pointerToKeySeq() %j',
        (testData) => {
            const keySeq = pointerToKeySeq(testData.pointer)
            expect(keySeq.equals(testData.keySeqPointer)).toBe(true)
        },
    )
})
