import { List, Map, OrderedMap } from 'immutable'
import {
    validateItems,
    validateContains,
    validateUniqueItems,
    validateArrayContent,
    ERROR_DUPLICATE_ITEMS,
    arrayValidator,
} from '@ui-schema/ui-schema/Validators/ArrayValidator'
import { createOrderedMap } from '@ui-schema/ui-schema/Utils'
import { validateAdditionalItems } from '@ui-schema/ui-schema/Validators/ArrayValidator/ArrayValidator'
import { ERROR_WRONG_TYPE } from '@ui-schema/ui-schema/Validators/TypeValidator/TypeValidator'
import { createValidatorErrors } from '@ui-schema/ui-schema/ValidatorStack/ValidatorErrors'

describe('validateArrayContent', () => {
    test.each([
        [createOrderedMap({
            type: 'number',
        }), [1, 2, 3], undefined, 0],
        [createOrderedMap({
            type: 'number',
        }), ['1'], undefined, 1],
        [createOrderedMap({
            type: 'number',
        }), [1, 2, 3], undefined, 0],
        [createOrderedMap({
            type: 'number',
        }), ['1'], undefined, 1],
        [List([
            createOrderedMap({
                type: 'number',
            }),
            createOrderedMap({
                type: 'number',
            }),
            createOrderedMap({
                type: 'number',
            }),
        ]), [[1, 2, 3], [1, 2, 3], [1, 2, 3]], false, 0],
        [List([
            createOrderedMap({
                type: 'number',
            }),
            createOrderedMap({
                type: 'number',
            }),
            createOrderedMap({
                type: 'number',
            }),
        ]), ['no-tuple', [1, 2, 3], [1, 2, 3]], false, 1],
        [List([
            createOrderedMap({
                type: 'number',
            }),
            createOrderedMap({
                type: 'number',
            }),
            createOrderedMap({
                type: 'number',
            }),
        ]), ['no-tuple', [1, 2, 3], 'no-tuple'], false, 2],
        [List([
            createOrderedMap({
                type: 'number',
            }),
            createOrderedMap({
                type: 'number',
            }),
            createOrderedMap({
                type: 'number',
            }),
        ]), [[1, 2, 3], [1, 2, 3], [1, 2, 3]], true, 0],
        [List([
            createOrderedMap({
                type: 'number',
            }),
            createOrderedMap({
                type: 'number',
            }),
            createOrderedMap({
                type: 'number',
            }),
        ]), [[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]], false, 3],
        [List([
            createOrderedMap({
                type: 'number',
            }),
            createOrderedMap({
                type: 'number',
            }),
            createOrderedMap({
                type: 'number',
            }),
        ]), [[1, 2, 3], [1, 2, 3, 4], [1, 2, 3]], false, 1],
        /*
        `validateArrayContent` is only responsible for tuple validation `additionalItems` and checking if a tuple is really a tuple
        deep-schema validation is not it's responsible

        [List([
            createOrderedMap({
                type: 'number'
            }),
            createOrderedMap({
                type: 'number'
            }),
            createOrderedMap({
                type: 'number'
            })
        ]), [1, 2, 3, 4], false, undefined, 1],
        [List([
            createOrderedMap({
                type: 'number'
            }),
            createOrderedMap({
                type: 'number'
            }),
            createOrderedMap({
                type: 'number'
            })
        ]), [1, 2, 3, 4], true, undefined, 0],
        [List([
            createOrderedMap({
                type: 'number'
            }),
            createOrderedMap({
                type: 'string'
            }),
            createOrderedMap({
                type: 'number'
            })
        ]), [1, 2, 3], false, undefined, 1],
        [List([
            createOrderedMap({
                type: 'number'
            }),
            createOrderedMap({
                type: 'number'
            }),
            createOrderedMap({
                type: 'number'
            })
        ]), [1, '2', false], false, undefined, 2],
        [List([
            createOrderedMap({
                type: 'number'
            }),
            createOrderedMap({
                type: 'number'
            }),
            createOrderedMap({
                type: 'number'
            })
        ]), [1, 2, 3, 4], false, false, 1],
        [List([
            createOrderedMap({
                type: 'number'
            }),
            createOrderedMap({
                type: 'number'
            }),
            createOrderedMap({
                type: 'number'
            })
        ]), [1, 2, 3, 4], true, false, 0],
        [List([
            createOrderedMap({
                type: 'number'
            }),
            createOrderedMap({
                type: 'string'
            }),
            createOrderedMap({
                type: 'boolean'
            })
        ]), [1, 'text', true], true, false, 0],*/
    ])('validateArrayContent(%j, %j, %s): %s', (schema, value, additionalItems, expected) => {
        const r = validateArrayContent(schema, value, additionalItems)
        expect(r.err.errCount).toBe(expected)
    })
})

describe('validateItems', () => {
    test.each([
        [{
            type: 'array',
            items: {
                type: 'number',
            },
        }, [1, 2, 3], 0],
        [{
            type: 'array',
            items: {
                type: 'number',
            },
        }, ['1', 2, 3], 1],
        [{
            type: 'array',
            items: {
                type: 'number',
            },
        }, ['1', '2', 3], 2],
        [{
            type: 'array',
            items: {
                type: 'number',
            },
        }, List([1, 2, 3]), 0],
        [{
            type: 'array',
            items: {
                type: 'number',
            },
        }, List(['1', 2, 3]), 1],
        [{
            type: 'array',
            items: {
                type: 'number',
            },
        }, List(['1', '2', 3]), 2],
        [{
            type: 'array',
        }, List(['1', '2', 3]), 0],
    ])('validateItems(%j, %j)', (schema, value, expected) => {
        expect(validateItems(createOrderedMap(schema), value).errCount).toBe(expected)
    })
})

describe('validateContains', () => {
    test.each([
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
        }, [1, 2, 3], 0],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
        }, ['1', '2', '3'], 3],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
        }, List([1, 2, 3]), 0],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
        }, List(['1', '2', '3']), 3],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
        }, ['1', '2', 3], 0],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
        }, [1, '2', '3'], 0],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
        }, [1], 0],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            minContains: 2,
        }, [1], 1],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            minContains: 2,
        }, [1, 2], 0],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            minContains: 0,
        }, [], 0],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            minContains: 2,
            maxContains: 4,
        }, [1], 1],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            minContains: 2,
            maxContains: 4,
        }, [1, 2], 0],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            minContains: 2,
            maxContains: 4,
        }, [1, 2, 3], 0],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            minContains: 2,
            maxContains: 4,
        }, [1, 2, 3, 4], 0],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            minContains: 2,
            maxContains: 4,
        }, [1, 2, 3, 4, 5], 1],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            minContains: 0,
            maxContains: 1,
        }, [], 0],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            maxContains: 2,
        }, [1, 2, 3], 1],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            maxContains: 2,
        }, [1, 2, 3, '3'], 2],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            maxContains: 2,
        }, [1, 2], 0],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            maxContains: 2,
        }, [], 1],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
        }, [], 1],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
        }, List([]), 1],
        [{
            type: 'array',
        }, List([]), 0],
        [{
            type: 'array',
            contains: {},
        }, List([]), 0],
    ])('validateContains(%j, %j)', (schema, value, expected) => {
        expect(validateContains(createOrderedMap(schema), value).errCount).toBe(expected)
    })
})

describe('validateAdditionalItems', () => {
    test.each([
        [
            true,
            [1],
            [createOrderedMap({
                type: 'number',
            })],
            true,
        ], [
            true,
            [1, 2],
            [createOrderedMap({
                type: 'number',
            })],
            true,
        ], [
            false,
            [1, 2],
            [createOrderedMap({
                type: 'number',
            })],
            false,
        ], [
            false,
            [1],
            [createOrderedMap({
                type: 'number',
            })],
            true,
        ], [
            false,
            List([1, 2]),
            [createOrderedMap({
                type: 'number',
            })],
            false,
        ], [
            false,
            List([1]),
            [createOrderedMap({
                type: 'number',
            })],
            true,
        ],
    ])('validateAdditionalItems(%s, %j, %j)', (additionalItems, value, schema, expected) => {
        expect(validateAdditionalItems(additionalItems, value, List(schema))).toBe(expected)
    })
})

describe('validateUniqueItems', () => {
    test.each([
        [
            {
                type: 'array',
                uniqueItems: true,
            },
            [1, 2, 3],
            true,
        ], [
            {
                type: 'array',
                uniqueItems: true,
            },
            [1, 2, 2],
            false,
        ], [
            {
                type: 'array',
                uniqueItems: false,
            },
            [2, 2],
            true,
        ], [
            {
                type: 'array',
            },
            [2, 2],
            true,
        ], [
            {
                type: 'array',
                uniqueItems: true,
            },
            List([1, 2, 3]),
            true,
        ], [
            {
                type: 'array',
                uniqueItems: true,
            },
            List([1, 2, 2]),
            false,
        ],
    ])('validateUniqueItems(%j, %j)', (schema, value, expected) => {
        expect(validateUniqueItems(createOrderedMap(schema), value)).toBe(expected)
    })
})

describe('arrayValidator', () => {
    test.each([
        [OrderedMap({type: 'array'}), true],
        [OrderedMap({type: 'string'}), false],
        [OrderedMap({}), false],
    ])(
        '.should(%j, %s)',
        (schema, expectedValid) => {
            expect(arrayValidator.should({schema})).toBe(expectedValid)
        }
    )

    test.each([
        [
            {type: 'array', uniqueItems: true},
            ['text1'],
            List([ERROR_DUPLICATE_ITEMS, Map()]),
            true,
            false,
        ], [
            {type: 'array', uniqueItems: true},
            ['text1', 'text1'],
            List([ERROR_DUPLICATE_ITEMS, Map()]),
            false,
            true,
        ], [
            {
                type: 'array',
                items: {
                    type: 'number',
                },
            },
            [1, 2],
            List([ERROR_WRONG_TYPE, Map()]),
            true,
            false,
        ], [
            {
                type: 'array',
                items: {
                    type: 'number',
                },
            },
            ['1', 2],
            List([ERROR_WRONG_TYPE, Map()]),
            false,
            true,
        ], [
            {
                type: 'array',
                contains: {
                    type: 'number',
                },
            },
            ['1', 2],
            List([ERROR_WRONG_TYPE, Map()]),
            true,
            false,
        ], [
            {
                type: 'array',
                contains: {
                    type: 'number',
                },
            },
            ['1'],
            List([ERROR_WRONG_TYPE, Map()]),
            false,
            true,
        ],
    ])(
        '.validate(%j, %s)',
        (schema, value, error, expectedValid, expectedError) => {
            const result = arrayValidator.validate({
                schema: createOrderedMap(schema),
                value,
                errors: createValidatorErrors(),
                valid: true,
            })
            expect(result.valid).toBe(expectedValid)
            expect(result.errors.hasError(error.get(0))).toBe(expectedError)
            if (result.errors.hasError(error.get(0))) {
                expect(result.errors.getError(error.get(0)).get(0).equals(error.get(1))).toBe(expectedError)
            }
        }
    )
})
