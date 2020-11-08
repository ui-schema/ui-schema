import { expect, describe } from '@jest/globals'
import { unescapePointer } from './unescapePointer'

describe('JSONPointer', () => {
    test.each([
        ['~0', '~'],
        ['~1', '/'],
        ['d~1a~0b~1c~0', 'd/a~b/c~'],
    ])(
        'unescapePointer(%j): %j',
        (input: string, output: string) => {
            expect(unescapePointer(input)).toBe(output)
        }
    )
})
