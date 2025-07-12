import { test, expect, describe } from '@jest/globals'
import { makeParams, ValidatorParams } from '@ui-schema/json-schema/Validator'
import { arrayValidator, ERROR_WRONG_TYPE } from '@ui-schema/json-schema/Validators'
import { isImmutable, List, Map } from 'immutable'
import { newMockState, newMockStateNested } from '../../../tests/mocks/ValidatorState.mock.js'
import {
    validateItems,
    validateContains,
    validateUniqueItems,
    validateArrayContent,
    validateAdditionalItems, ERROR_DUPLICATE_ITEMS,
} from './ArrayValidator.js'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'

describe('validateArrayContent', () => {
    test.each<[any, unknown, boolean | undefined, number, ValidatorParams | undefined]>([
        [createOrderedMap({
            type: 'number',
        }), [1, 2, 3], undefined, 0, undefined],
        [createOrderedMap({
            type: 'number',
        }), ['1'], undefined, 1, undefined],
        [createOrderedMap({
            type: 'number',
        }), [1, 2, 3], undefined, 0, undefined],
        [createOrderedMap({
            type: 'number',
        }), ['1'], undefined, 1, undefined],
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
        ]), [1, 2, 3], true, 0, {...makeParams(), recursive: false}],
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
        ]), ['abc', 2, null], true, 2, {...makeParams(), recursive: true}],
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
        ]), [1, 2, 3], true, 0, undefined],
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
        ]), [1, 2, 3], false, 0, undefined],
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
        ]), 'no-tuple', false, 1, undefined],
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
        ]), [1, 2, 3, 4], false, 1, undefined],
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
        ]), [[1, 2, 3], [1, 2, 3, 4], [1, 2, 3]], false, 0, undefined],
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
        ]), [[1, 2, 3], [1, 2, 3, 4], [1, 2, 3]], true, 0, undefined],
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
        ]), [[1, 2, 3], [1, 2, 3, 4], [1, 2, 3], [1, 2, 3, 4, 5, 6]], false, 1, undefined],
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
        ]), [[1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3]], false, 1, undefined],
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
    ])('validateArrayContent(%j, %j, %s): %s', (schema, value, additionalItems, expected, params) => {
        const r = validateArrayContent(schema, value, additionalItems, {...params || makeParams(), ...newMockStateNested()})
        if (r.output.errCount !== expected) {
            console.log(
                'failed validateArrayContent',
                schema.toJS(),
                isImmutable(value) ? value.toJS() : value,
                r.output.errors,
            )
        }
        expect(r.output.errCount).toBe(expected)
    })
})

describe('validateItems', () => {
    test.each<[any, unknown, number, ValidatorParams | undefined]>([
        [{
            type: 'array',
            items: {
                type: 'number',
            },
        }, [1, 2, 3], 0, undefined],
        [{
            type: 'array',
            items: {
                type: 'number',
            },
        }, ['1', 2, 3], 1, undefined],
        [{
            type: 'array',
            items: {
                type: 'null',
            },
        }, [null, null, null], 0, undefined],
        [{
            type: 'array',
            items: {
                type: 'null',
            },
        }, [null, 0, null], 1, undefined],
        [{
            type: 'array',
            items: {
                type: 'number',
            },
        }, ['1', '2', 3], 2, undefined],
        [{
            type: 'array',
            items: {
                type: 'number',
            },
        }, List([1, 2, 3]), 0, undefined],
        [{
            type: 'array',
            items: {
                type: 'number',
            },
        }, List(['1', 2, 3]), 1, undefined],
        [{
            type: 'array',
            items: {
                type: 'number',
            },
        }, List(['1', '2', 3]), 2, undefined],
        [{
            type: 'array',
        }, List(['1', '2', 3]), 0, undefined],
        [{
            type: 'array',
            additionalItems: true,
            items: [
                {
                    type: 'number',
                },
                {
                    type: 'number',
                },
                {
                    type: 'number',
                },
            ],
        }, [1, 2, 3], 0, undefined],
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
        }, [1, 2, 3], 0, undefined],
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
        }, 'no-tuple', 1, undefined],
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
        }, ['no-tuple', 3, 'no-tuple'], 0, {...makeParams(), recursive: false}],
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
        }, ['no-tuple', 3, 'no-tuple'], 2, {...makeParams(), recursive: true}],
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
        }, [1, 2, 3, 4], 1, undefined],
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
        }, [1, 2, 3, 4], 0, undefined],
        [{
            type: 'array',
            items: {
                type: 'array',
                additionalItems: false,
                items: [
                    {type: 'number'},
                    {type: 'number'},
                    {type: 'number'},
                ],
            },
        }, [[1, 2, 3], [1, 2, 3, 4], [1, 2, 3]], 0, {...makeParams(), recursive: false}],
        [{
            type: 'array',
            items: {
                type: 'array',
                additionalItems: false,
                items: [
                    {type: 'number'},
                    {type: 'number'},
                    {type: 'number'},
                ],
            },
        }, [[1, 2, 3], [1, 2, 3, 4], [1, 2, 3]], 1, {...makeParams(), recursive: true}],
    ])('validateItems(%j, %j)', (schema, value, expected, params) => {
        const state = newMockState()
        validateItems(createOrderedMap(schema), value, {...params || makeParams(), ...state})
        if (state.output.errCount !== expected) {
            console.log(
                'failed validateItems',
                isImmutable(schema) ? schema.toJS() : schema,
                isImmutable(value) ? value.toJS() : value,
                state.output.errors,
            )
        }
        expect(state.output.errCount).toBe(expected)
    })
})

describe('validateContains', () => {
    test.each<[any, unknown, number, ValidatorParams | undefined]>([
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
        }, [1, 2, 3], 0, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
        }, ['1', '2', '3'], 3, undefined],
        [{
            type: 'array',
            contains: {
                type: 'null',
            },
        }, [1, 2, 3], 3, undefined],
        [{
            type: 'array',
            contains: {
                type: 'null',
            },
        }, [null, null, null], 0, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
        }, List([1, 2, 3]), 0, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
        }, List(['1', '2', '3']), 3, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
        }, ['1', '2', 3], 0, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
        }, [1, '2', '3'], 0, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
        }, [1], 0, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            minContains: 2,
        }, [1], 1, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            minContains: 2,
        }, [1, 2], 0, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            minContains: 0,
        }, [], 0, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            minContains: 2,
            maxContains: 4,
        }, [1], 1, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            minContains: 2,
            maxContains: 4,
        }, [1, 2], 0, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            minContains: 2,
            maxContains: 4,
        }, [1, 2, 3], 0, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            minContains: 2,
            maxContains: 4,
        }, [1, 2, 3, 4], 0, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            minContains: 2,
            maxContains: 4,
        }, [1, 2, 3, 4, 5], 1, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            minContains: 0,
            maxContains: 1,
        }, [], 0, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            maxContains: 2,
        }, [1, 2, 3], 1, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            maxContains: 2,
        }, [1, 2, 3, '3'], 2, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            maxContains: 2,
        }, [1, 2], 0, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
            maxContains: 2,
        }, [], 1, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
        }, [], 1, undefined],
        [{
            type: 'array',
            contains: {
                type: 'number',
            },
        }, List([]), 1, undefined],
        [{
            type: 'array',
        }, List([]), 0, undefined],
        [{
            type: 'array',
            contains: {},
        }, List([]), 0, undefined],
    ])('validateContains(%j, %j)', (schema, value, expected, params) => {
        const state = newMockState()
        validateContains(createOrderedMap(schema), value, {...params || makeParams(), ...state})
        expect(state.output.errCount).toBe(expected)
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
        ],
        [
            true,
            [1, 2],
            [createOrderedMap({
                type: 'number',
            })],
            true,
        ],
        [
            false,
            [1, 2],
            [createOrderedMap({
                type: 'number',
            })],
            false,
        ],
        [
            false,
            [1],
            [createOrderedMap({
                type: 'number',
            })],
            true,
        ],
        [
            false,
            List([1, 2]),
            [createOrderedMap({
                type: 'number',
            })],
            false,
        ],
        [
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
        ],
        [
            {
                type: 'array',
                uniqueItems: true,
            },
            [1, 2, 2],
            false,
        ],
        [
            {
                type: 'array',
                uniqueItems: false,
            },
            [2, 2],
            true,
        ],
        [
            {
                type: 'array',
            },
            [2, 2],
            true,
        ],
        [
            {
                type: 'array',
                uniqueItems: true,
            },
            List([1, 2, 3]),
            true,
        ],
        [
            {
                type: 'array',
                uniqueItems: true,
            },
            List([1, 2, 2]),
            false,
        ],
        [
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
        [
            {type: 'array', uniqueItems: true},
            ['text1'],
            undefined,
            true,
        ],
        [
            {type: 'array', uniqueItems: true},
            ['text1', 'text1'],
            [{error: ERROR_DUPLICATE_ITEMS, instanceLocation: '', keywordLocation: '/uniqueItems'}],
            false,
        ],
        [
            {
                type: 'array',
                items: {
                    type: 'number',
                },
            },
            [1, 2],
            undefined,
            true,
        ],
        [
            {
                type: 'array',
                items: {
                    type: 'number',
                },
            },
            ['1', 2],
            undefined,
            // has error, but childError, thus valid - as this test only tests not recursive
            true,
        ],
        [
            {
                type: 'array',
                contains: {
                    type: 'number',
                },
            },
            ['1', 2],
            undefined,
            true,
        ],
        [
            {
                type: 'array',
                contains: {
                    type: 'number',
                },
            },
            ['1'],
            [{error: ERROR_WRONG_TYPE, context: {actual: 'string'}, instanceLocation: '/0', keywordLocation: '/contains/items/type'}],
            false,
        ],
    ])(
        'arrayValidator.validate(%j, %s)',
        (schema, value, errors, expectedValid) => {
            const state = newMockState()
            arrayValidator.validate(
                createOrderedMap(schema),
                value,
                {...makeParams(), ...state},
            )
            // expect(result.valid).toBe(expectedValid)
            expect(state.output.errCount === 0).toBe(expectedValid)
            if (errors) {
                expect(state.output.errors).toStrictEqual(errors)
            } else {
                // todo: test childErrors for array items
            }
        },
    )
})
