import { List, Map } from 'immutable'
import {
    validateItems,
    validateContains,
    validateUniqueItems,
    validateArrayContent,
    ERROR_DUPLICATE_ITEMS,
    arrayValidator,
} from '@ui-schema/system/Validators/ArrayValidator'
import { createOrderedMap } from '@ui-schema/system/createMap'
import { validateAdditionalItems } from '@ui-schema/system/Validators/ArrayValidator'
import { ERROR_WRONG_TYPE } from '@ui-schema/system/Validators/TypeValidator'
import { createValidatorErrors } from '@ui-schema/system/ValidatorErrors'

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
            // at <= 0.2.0-rc.3 this was correct (errCount: 0),
            // assuming this was correct, but resulted from incorrect array tuple implementation,
            // `items` array tuple validation is now implemented with:
            // - correct nesting in `GenericList`/`Table`/`VirtualWidgetRenderer`
            // - validation of arrays in `validateItems()`
            // - todo: currently only supporting one level of arrays in conditionals like `if`/`else`
            //         no problem for rendering, as validated by next schema level
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
        ]), [1, 2, 3], true, 0],
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
        ]), [1, 2, 3], false, 0],
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
        ]), 'no-tuple', false, 1],
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
        ]), [1, 2, 3, 4], false, 1],
        [List([
            createOrderedMap({
                type: 'array',
            }),
            createOrderedMap({
                type: 'array',
            }),
            createOrderedMap({
                type: 'array',
            }),
        ]), [[1, 2, 3], [1, 2, 3, 4], [1, 2, 3]], false, 0],
        [List([
            createOrderedMap({
                type: 'array',
            }),
            createOrderedMap({
                type: 'array',
            }),
            createOrderedMap({
                type: 'array',
            }),
        ]), [[1, 2, 3], [1, 2, 3, 4], [1, 2, 3]], true, 0],
        [List([
            createOrderedMap({
                type: 'array',
            }),
            createOrderedMap({
                type: 'array',
            }),
            createOrderedMap({
                type: 'array',
            }),
        ]), [[1, 2, 3], [1, 2, 3, 4], [1, 2, 3], [1, 2, 3, 4, 5, 6]], false, 1],
        [List([
            createOrderedMap({
                type: 'array',
            }),
            createOrderedMap({
                type: 'array',
            }),
            createOrderedMap({
                type: 'array',
            }),
        ]), [[1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3]], false, 1],
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
        if (r.err.errCount !== expected) {
            // @ts-ignore
            console.log('failed validateArrayContent', schema.toJS(), value && value.toJS ? value.toJS() : value, r.err.toJS())
        }
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
                type: 'null',
            },
        }, [null, null, null], 0],
        [{
            type: 'array',
            items: {
                type: 'null',
            },
        }, [null, 0, null], 1],
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
        [{
            type: 'array',
            additionalItems: true,
            items: [{
                type: 'number',
            }, {
                type: 'number',
            }, {
                type: 'number',
            }],
        }, [1, 2, 3], 0],
        [{
            type: 'array',
            additionalItems: false,
            items: [{
                type: 'number',
            }, {
                type: 'number',
            }, {
                type: 'number',
            }],
        }, [1, 2, 3], 0],
        [{
            type: 'array',
            additionalItems: false,
            items: [{
                type: 'number',
            }, {
                type: 'number',
            }, {
                type: 'number',
            }],
        }, 'no-tuple', 1],
        [{
            type: 'array',
            additionalItems: false,
            items: [{
                type: 'number',
            }, {
                type: 'number',
            }, {
                type: 'number',
            }],
            // todo: currently `0` error, but for full `if` support needed
            //       only validating nested tuple schemas in render-flow
        }, ['no-tuple', 3, 'no-tuple'], 0],
        [{
            type: 'array',
            additionalItems: false,
            items: [{
                type: 'number',
            }, {
                type: 'number',
            }, {
                type: 'number',
            }],
        }, [1, 2, 3, 4], 1],
        [{
            type: 'array',
            additionalItems: true,
            items: [{
                type: 'number',
            }, {
                type: 'number',
            }, {
                type: 'number',
            }],
        }, [1, 2, 3, 4], 0],
        [{
            type: 'array',
            items: {
                type: 'array',
                additionalItems: false,
                items: [{
                    type: 'number',
                }, {
                    type: 'number',
                }, {
                    type: 'number',
                }],
            },
            // todo: currently `0` error, but for full `if` support needed
            //       only validating nested tuple schemas in render-flow
        }, [[1, 2, 3], [1, 2, 3, 4], [1, 2, 3]], 0],
    ])('validateItems(%j, %j)', (schema, value, expected) => {
        const r = validateItems(createOrderedMap(schema), value)
        if (r.errCount !== expected) {
            // @ts-ignore
            console.log('failed validateItems', schema.toJS(), value && value.toJS ? value.toJS() : value, r.toJS())
        }
        expect(r.errCount).toBe(expected)
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
                type: 'null',
            },
        }, [1, 2, 3], 3],
        [{
            type: 'array',
            contains: {
                type: 'null',
            },
        }, [null, null, null], 0],
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
        ], [
            {
                type: 'array',
                uniqueItems: true,
            },
            Map({prop_a: 2, prop_b: 2}),
            true,
        ],
    ])('validateUniqueItems(%j, %j)', (schema, value, expected) => {
        expect(validateUniqueItems(createOrderedMap(schema), value)).toBe(expected)
    })
})

describe('arrayValidator', () => {
    test.each([
        [List(), true],
        [[], true],
        [Map(), false],
        ['some-text', false],
    ])(
        '.should(%j, %s)',
        (value, expectedValid) => {
            // @ts-ignore
            expect(arrayValidator.should({value})).toBe(expectedValid)
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
            // has error, but childError, thus empty errors
            List(),
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
        '.handle(%j, %s)',
        (schema, value, error, expectedValid, expectedError) => {
            const result = arrayValidator.handle({
                schema: createOrderedMap(schema),
                // @ts-ignore
                value,
                errors: createValidatorErrors(),
                valid: true,
            })
            expect(result.valid).toBe(expectedValid)
            if (error.size) {
                expect(result.errors.hasError(error.get(0))).toBe(expectedError)
                if (result.errors.hasError(error.get(0))) {
                    expect(result.errors.getError(error.get(0)).get(0)?.equals(error.get(1))).toBe(expectedError)
                }
            } else {
                // todo: test childErrors for array items
            }
        }
    )
})
