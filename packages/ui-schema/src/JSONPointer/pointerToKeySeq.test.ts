import { expect, describe } from '@jest/globals'
import { pointerToKeySeq } from './pointerToKeySeq'
import { testCases } from './JSONPointer.mock'

describe('JSONPointer', () => {
    test.each(testCases)(
        'pointerToKeySeq() %j',
        (testData) => {
            const keySeq = pointerToKeySeq(testData.pointer)
            expect(keySeq.equals(testData.keySeqPointer)).toBe(true)
        }
    )
})
