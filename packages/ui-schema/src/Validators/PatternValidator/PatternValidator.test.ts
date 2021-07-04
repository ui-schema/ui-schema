import { OrderedMap } from 'immutable'
import { describe, test, expect } from '@jest/globals'
import { validatePattern, patternValidator, ERROR_PATTERN } from '@ui-schema/ui-schema/Validators/PatternValidator'
import { createValidatorErrors } from '@ui-schema/ui-schema/ValidatorErrors/ValidatorErrors'
import { SchemaTypesType } from '@ui-schema/ui-schema'

describe('validatePattern', () => {
    test.each([
        ['string', 'blabla', '^[bla]*$', true],
        ['string', 'wawawa', '^[bla]*$', false],
        ['string', 'wawawa', undefined, true],
        [['string'], 'wawawa', undefined, true],
        [['string'], 'wawawa', '^[bla]*$', false],
        [['integer', 'string'], 'wawawa', '^[bla]*$', false],
        [['integer', 'string'], 122, '^[bla]*$', true],
        ['array', [], '^[bla]*$', true],
        ['array', [], undefined, true],
    ])('validatePattern(%j, %j, %j): %j', (type: SchemaTypesType, value: any, pattern: string | undefined, expected: boolean) => {
        expect(validatePattern(type, value, pattern)).toBe(expected)
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
