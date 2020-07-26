import { OrderedMap, List } from "immutable"
import { test, expect } from '@jest/globals'
import { validatePattern, patternValidator, ERROR_PATTERN } from '@ui-schema/ui-schema/Validators/PatternValidator'

test('validatePattern', () => {
    expect(validatePattern('string', 'blabla', '^[bla]*$')).toBe(true)
    expect(validatePattern('string', 'wawawa', '^[bla]*$')).toBe(false)
    expect(validatePattern('string', 'wawawa')).toBe(true)
    expect(validatePattern('array', [], '^[bla]*$')).toBe(true)
    expect(validatePattern('array', [])).toBe(true)
})

test('patternValidator', () => {
    const trueResult = patternValidator.validate({
        schema: OrderedMap({
            type: 'string',
            pattern: '^[bla]*$'
        }),
        value: 'blabla',
        errors: List([]),
        valid: true
    })
    expect(trueResult.valid).toBe(true)
    expect(trueResult.errors.contains(ERROR_PATTERN)).toBe(false)

    const falseResult = patternValidator.validate({
        schema: OrderedMap({
            type: 'string',
            pattern: '^[bla]*$'
        }),
        value: 'wawawa',
        errors: List([]),
        valid: true
    })
    expect(falseResult.valid).toBe(false)
    expect(falseResult.errors.contains(ERROR_PATTERN)).toBe(true)
})
