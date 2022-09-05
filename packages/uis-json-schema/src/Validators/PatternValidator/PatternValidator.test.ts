import { OrderedMap } from 'immutable'
import { describe, test, expect } from '@jest/globals'
import { validatePattern, patternValidator, ERROR_PATTERN } from '@ui-schema/json-schema/Validators/PatternValidator'
import { createValidatorErrors } from '@ui-schema/system/ValidatorErrors'

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

test('patternValidator', () => {
    const trueResult = patternValidator.handle({
        schema: OrderedMap({
            type: 'string',
            pattern: '^[bla]*$',
        }),
        value: 'blabla',
        errors: createValidatorErrors(),
        valid: true,
    })
    expect(trueResult.valid).toBe(true)
    expect(trueResult.errors.hasError(ERROR_PATTERN)).toBe(false)

    const falseResult = patternValidator.handle({
        schema: OrderedMap({
            type: 'string',
            pattern: '^[bla]*$',
        }),
        value: 'wawawa',
        errors: createValidatorErrors(),
        valid: true,
    })
    expect(falseResult.valid).toBe(false)
    expect(falseResult.errors.hasError(ERROR_PATTERN)).toBe(true)
})
