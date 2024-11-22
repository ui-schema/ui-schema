import { expect, describe, test } from '@jest/globals'
import { resolvePointer } from './resolvePointer.js'
import { fromJS } from 'immutable'
import { testCases } from '../JSONPointer.mock.js'

describe('JSONPointer', () => {
    test.each(testCases)(
        'resolvePointer() %j',
        (testData) => {
            expect(
                resolvePointer(testData.pointer, fromJS(testData.data)),
            ).toBe(testData.value)
        },
    )
})
