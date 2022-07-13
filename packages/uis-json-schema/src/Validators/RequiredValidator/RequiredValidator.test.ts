import { List, OrderedMap } from 'immutable'
import { checkValueExists, ERROR_NOT_SET, requiredValidator } from '@ui-schema/json-schema/Validators/RequiredValidator'
import { createValidatorErrors } from '@ui-schema/system/ValidatorErrors/ValidatorErrors'

describe('checkValueExists', () => {
    test.each([
        ['text1', 'string', true],
        ['', 'string', false],
        [undefined, 'string', false],
        [0, 'string', true],
        [true, 'string', true],
        [[], 'string', true],
        [{}, 'string', true],
        [0, 'number', true],
        ['', 'number', false],
        ['', 'number', false],
        [0, 'integer', true],
        ['', 'integer', false],
        ['', 'integer', false],
        [true, 'boolean', true],
        [false, 'boolean', true],
        [undefined, 'boolean', false],
        [[], 'array', true],
        ['', 'array', true],
        [undefined, 'array', false],
        [{}, 'object', true],
        ['', 'object', true],
        [undefined, 'object', false],
    ] as [any, string, boolean][])('checkValueExists(%j, %s)', (value, type, expected) => {
        expect(checkValueExists(type, value)).toBe(expected)
    })
})

describe('requiredValidator', () => {
    test.each(([
        [List(['name']), List(['name']), true],
        [List(['name']), List(['street']), false],
        [undefined, 'name', false],
        [undefined, 'name', false],
    ]) as [List<string> | undefined, string, boolean][])(
        '.should(%j, %s)',
        (requiredList, storeKeys, expectedValid) => {
            expect(requiredValidator.should({
                requiredList: requiredList,
                storeKeys,
            })).toBe(expectedValid)
        }
    )

    test.each([
        [
            'string',
            'text1',
            ERROR_NOT_SET,
            true,
            false,
        ], [
            'string',
            2,
            ERROR_NOT_SET,
            true,
            false,
        ], [
            'string',
            '2',
            ERROR_NOT_SET,
            true,
            false,
        ], [
            'string',
            '',
            ERROR_NOT_SET,
            false,
            true,
        ], [
            'string',
            undefined,
            ERROR_NOT_SET,
            false,
            true,
        ],
    ])(
        '.handle(%j, %s)',
        (type, value, error, expectedValid, expectedError) => {
            const result = requiredValidator.handle({
                schema: OrderedMap({type}),
                value,
                errors: createValidatorErrors(),
                valid: true,
            })
            expect(result.valid).toBe(expectedValid)
            expect(result.errors.hasError(error)).toBe(expectedError)
        }
    )

    test(
        '.noHandle(%j, %s)',
        () => {
            const result = requiredValidator.noHandle()
            expect(result.required).toBe(false)
        }
    )
})
