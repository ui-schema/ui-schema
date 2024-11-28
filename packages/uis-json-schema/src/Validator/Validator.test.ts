import { expect, describe, test } from '@jest/globals'
import { Map } from 'immutable'
import { createRegister, Validator } from './Validator.js'

/**
 * npm run tdd -- --testPathPattern=Validator/Validator.test.ts --selectProjects=test-@ui-schema/json-schema
 */

describe('Validator', () => {
    test('Validator', () => {
        const validator = Validator([])
        expect(validator.validateValue.errors).toStrictEqual([])
        expect(validator.validateValue).toBeInstanceOf(Function)
        expect(validator.validate).toBeInstanceOf(Function)
    })

    test('createRegister non-type handlers', () => {
        const register = createRegister([
            {
                validate: () => {
                    // noop
                },
            },
        ])

        expect(register.valueHandlers.size).toBe(0)
        expect(register.handlers.length).toBe(1)
    })

    test('createRegister type handlers', () => {
        const register = createRegister([
            {
                types: ['string'],
                validate: () => {
                    // noop
                },
            },
        ])

        expect(register.valueHandlers.size).toBe(1)
        expect(register.valueHandlers.has('string')).toBe(true)
        expect(register.valueHandlers.get('string')!.length).toBe(1)
        expect(register.handlers.length).toBe(0)
    })

    test('createRegister mixed handlers', () => {
        const register = createRegister([
            {
                types: ['string'],
                validate: () => {
                    // noop
                },
            },
            {
                validate: () => {
                    // noop
                },
            },
        ])

        expect(register.valueHandlers.size).toBe(1)
        expect(register.valueHandlers.has('string')).toBe(true)
        expect(register.valueHandlers.get('string')!.length).toBe(1)
        expect(register.handlers.length).toBe(1)
    })

    test('createRegister debug', () => {
        const register = createRegister([
            {
                types: ['string'],
                validate: () => {
                    // noop
                },
            },
            {
                validate: () => {
                    // noop
                },
            },
            {
                types: ['object'],
                validate: () => {
                    // noop
                },
            },
            {
                types: ['object', 'array'],
                validate: () => {
                    // noop
                },
            },
        ])

        const registerAsJson = {
            'valueHandlers': {
                'string': ['[Validator Function 0]'],
                'object': ['[Validator Function 2]', '[Validator Function 3]'],
                'array': ['[Validator Function 3]'],
            },
            'handlers': ['[Validator Function 1]'],
        }
        expect(JSON.stringify(register)).toBe(JSON.stringify(registerAsJson))
    })

    test('Validator validate simple', () => {
        const validator = Validator([
            {
                validate: (schema, value, _params, state) => {
                    const type = schema.get('type')
                    if (!type) return
                    // naive validator, not really json-schema
                    if (typeof value !== type) {
                        state.output.addError('invalid-type')
                    }
                },
            },
        ])

        const stringData: unknown = 'lorem'
        // successful
        const result1 = validator.validateValue<{ name: string }>(
            Map({
                type: 'string',
            }),
            stringData,
        )
        expect(result1).toBe(true)
        expect(validator.validateValue.errors).toStrictEqual([])

        // error
        const result2 = validator.validateValue<{ name: string }>(
            Map({
                type: 'string',
            }),
            12,
        )
        expect(result2).toBe(false)
        expect(validator.validateValue.errors).toStrictEqual([{error: 'invalid-type'}])

        // successful after error - has no .errors
        const result3 = validator.validateValue<{ name: string }>(
            Map({
                type: 'string',
            }),
            stringData,
        )
        expect(result3).toBe(true)
        expect(validator.validateValue.errors).toStrictEqual([])
    })
})
