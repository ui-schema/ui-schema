import { expect, describe, test } from '@jest/globals'
import { escapePointer } from './escapePointer.js'

describe('JSONPointer', () => {
    test.each([
        ['~', '~0'],
        ['/', '~1'],
        ['d/a~b/c~', 'd~1a~0b~1c~0'],
    ])(
        'escapePointer(%j): %j',
        (input: string, output: string) => {
            expect(escapePointer(input)).toBe(output)
        }
    )
})
