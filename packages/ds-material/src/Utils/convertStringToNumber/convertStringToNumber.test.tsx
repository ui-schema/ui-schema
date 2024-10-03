import { jest, it, expect, describe } from '@jest/globals'
import { convertStringToNumber } from './convertStringToNumber'

describe('convertStringToNumber', () => {
    it('convertStringToNumber', async () => {
        console.error = jest.fn()
        expect(convertStringToNumber('10', 'number')).toBe(10)
        expect(convertStringToNumber('010', 'number')).toBe(10)
        expect(convertStringToNumber('0', 'number')).toBe(0)
        expect(convertStringToNumber(0, 'number')).toBe(0)
        expect(convertStringToNumber('0.01', 'number')).toBe(0.01)
        expect(convertStringToNumber('0.00001', 'number')).toBe(0.00001)
        expect(convertStringToNumber(0.458, 'number')).toBe(0.458)
        expect(convertStringToNumber('10', 'integer')).toBe(10)
        expect(convertStringToNumber('010', 'integer')).toBe(10)
        expect(convertStringToNumber('010000000', 'integer')).toBe(10000000)
        expect(convertStringToNumber('0', 'integer')).toBe(0)
        expect(convertStringToNumber(0, 'number')).toBe(0)
        expect(convertStringToNumber('', 'number')).toBe('')
        expect(convertStringToNumber('010', 'string')).toBe('010')
        expect(convertStringToNumber('a010', 'number')).toBe(undefined)
    })
})
