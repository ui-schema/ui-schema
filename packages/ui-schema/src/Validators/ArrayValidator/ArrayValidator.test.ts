import { List, Map, OrderedMap } from "immutable"
import {
    validateItems,
    validateContains,
    validateUniqueItems,
    validateArrayContent,
    ERROR_DUPLICATE_ITEMS, ERROR_ADDITIONAL_ITEMS, ERROR_NOT_FOUND_CONTAINS,
    arrayValidator,
} from '@ui-schema/ui-schema/Validators/ArrayValidator'
import { createOrderedMap } from "@ui-schema/ui-schema/Utils"
import { validateAdditionalItems } from "@ui-schema/ui-schema/Validators/ArrayValidator/ArrayValidator"
import { ERROR_WRONG_TYPE } from "@ui-schema/ui-schema/Validators/TypeValidator/TypeValidator"

describe('validateArrayContent', () => {
    test.each([
        [createOrderedMap({
            type: 'number',
        }), [1, 2, 3], undefined, false, 0],
        [createOrderedMap({
            type: 'number',
        }), ['1'], undefined, false, 1],
        [createOrderedMap({
            type: 'number',
        }), [1, 2, 3], undefined, false, 0],
        [createOrderedMap({
            type: 'number',
        }), ['1'], undefined, false, 1],
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
        ]), [[1, 2, 3], [1, 2, 3], [1, 2, 3]], false, undefined, 0],
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
        ]), ['no-tuple', [1, 2, 3], [1, 2, 3]], false, undefined, 1],
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
        ]), ['no-tuple', [1, 2, 3], 'no-tuple'], false, undefined, 2],
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
        ]), [[1, 2, 3], [1, 2, 3], [1, 2, 3]], true, undefined, 0],
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
        ]), [[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]], false, undefined, 3],
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
        ]), [[1, 2, 3], [1, 2, 3, 4], [1, 2, 3]], false, undefined, 1],
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
    ])('validateArrayContent(%j, %j, %s, %s)', (schema, value, additionalItems, find, expected) => {
        const r = validateArrayContent(schema, value, additionalItems, find)
        expect(r.size).toBe(expected)
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
    ])('validateItems(%j, %j)', (schema, value, expected) => {
        expect(validateItems(createOrderedMap(schema), value).size).toBe(expected)
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
        }, [], 1],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
        }, List([]), 1],
    ])('validateContains(%j, %j)', (schema, value, expected) => {
        expect(validateContains(createOrderedMap(schema), value).size).toBe(expected)
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
        },
    )

    test.each([
        [
            {type: 'array', uniqueItems: true},
            ['text1'],
            ERROR_DUPLICATE_ITEMS,
            true,
            false,
        ], [
            {type: 'array', uniqueItems: true},
            ['text1', 'text1'],
            ERROR_DUPLICATE_ITEMS,
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
            List([ERROR_WRONG_TYPE, Map({arrayItems: true})]),
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
            List([ERROR_WRONG_TYPE, Map({arrayItems: true})]),
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
            List([ERROR_WRONG_TYPE, Map({arrayItems: true})]),
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
            ERROR_WRONG_TYPE,
            false,
            true,
        ],
    ])(
        '.validate(%j, %s)',
        (schema, value, error, expectedValid, expectedError) => {
            const result = arrayValidator.validate({
                schema: createOrderedMap(schema),
                value,
                errors: List([]),
                valid: true,
            })
            expect(result.valid).toBe(expectedValid)
            expect(result.errors.contains(error)).toBe(expectedError)
        },
    )
})
