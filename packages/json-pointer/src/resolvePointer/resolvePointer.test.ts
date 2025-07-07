import { expect, describe, test } from '@jest/globals'
import { resolvePointer } from './resolvePointer.js'
import { fromJS, List } from 'immutable'
import { testCases } from '../JSONPointer.mock.js'

describe('JSONPointer', () => {
    test.each(testCases)(
        'resolvePointer() %j (immutable)',
        (testData) => {
            expect(
                resolvePointer(testData.pointer, fromJS(testData.data)),
            ).toBe(testData.value)
        },
    )

    test.each(testCases)(
        'resolvePointer() %j (native-JS)',
        (testData) => {
            expect(
                resolvePointer(testData.pointer, testData.data),
            ).toBe(testData.value)
        },
    )

    test.each([
        {
            pointer: '/arr/length',
            data: {arr: [1, 2]},
            value: undefined,
        },
        {
            pointer: '/arr/length',
            data: {arr: List([1, 2])},
            value: undefined,
        },
        {
            pointer: '/obj/none',
            data: {obj: null},
            value: undefined,
        },
    ])(
        'resolvePointer() %j (not existing)',
        (testData) => {
            expect(
                resolvePointer(testData.pointer, testData.data),
            ).toBe(testData.value)
        },
    )
})
