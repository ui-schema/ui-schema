import { expect, describe, test } from '@jest/globals'
import { validateConst } from '@ui-schema/json-schema/Validators/ValueValidator'

describe('validateConst', () => {
    test('validateConst', () => {
        expect(validateConst('text1', 'text1')).toBe(true)
        expect(validateConst('text1', 'text2')).toBe(false)

        expect(validateConst(1, 1)).toBe(true)
        expect(validateConst(1, 2)).toBe(false)

        expect(validateConst(true, true)).toBe(true)
        expect(validateConst(true, false)).toBe(false)

        expect(validateConst(null, null)).toBe(true)
        expect(validateConst(null, 'null')).toBe(false)

        expect(validateConst({a: 1}, {a: 1})).toBe(true)
        expect(validateConst({a: 1}, {a: 2})).toBe(false)
        expect(validateConst({a: 1, b: true}, {a: 1, b: true})).toBe(true)
        expect(validateConst({a: 1, b: true}, {b: true, a: 1})).toBe(true)

        expect(validateConst({a: 1, b: {c: true}}, {a: 1, b: {c: true}})).toBe(true)

        expect(validateConst([1, 2], [1, 2])).toBe(true)
        expect(validateConst([1, 2], [2, 1])).toBe(false)
    })
})
