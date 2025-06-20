import { describe, test, expect } from '@jest/globals'
import { validatePattern } from '@ui-schema/json-schema/Validators/PatternValidator'

describe('validatePattern', () => {
    test.each([
        ['blabla', '^[bla]*$', true],
        ['wawawa', '^[bla]*$', false],
        ['wawawa', undefined, true],
        ['wawawa', undefined, true],
        ['wawawa', '^[bla]*$', false],
        ['wawawa', '^[bla]*$', false],
        [122, '^[bla]*$', true],
        [[], '^[bla]*$', true],
        [[], undefined, true],
    ])('validatePattern(%j, %j, %j): %j', (value: any, pattern: string | undefined, expected: boolean) => {
        expect(validatePattern(value, pattern)).toBe(expected)
    })
})
