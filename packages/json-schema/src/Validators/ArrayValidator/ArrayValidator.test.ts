import { test, expect, describe } from '@jest/globals'
import { ERROR_WRONG_TYPE } from '@ui-schema/json-schema/Validators/TypeValidator'
import { makeParams } from '@ui-schema/json-schema/Validator'
import { List } from 'immutable'
import { newMockState } from '../../../tests/mocks/ValidatorState.mock.js'
import {
    validateItems,
    validateContains,
    validateUniqueItems,
    arrayItemsValidator,
    ERROR_DUPLICATE_ITEMS,
    ERROR_ADDITIONAL_ITEMS,
    ERROR_MAX_CONTAINS,
    ERROR_MIN_CONTAINS,
    ERROR_NOT_FOUND_CONTAINS,
} from './ArrayValidator.js'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'

describe('validateUniqueItems', () => {
    test.each<[any, List<unknown> | unknown[], boolean, number, any[] | undefined]>([
        // valid: unique items
        [
            {uniqueItems: true},
            [1, 2, 3],
            true,
            0,
            undefined,
        ],
        // invalid: duplicate items
        [
            {uniqueItems: true},
            [1, 2, 2],
            false,
            1,
            [{
                error: ERROR_DUPLICATE_ITEMS,
                keywordLocation: '/uniqueItems',
                instanceLocation: '',
                context: {duplicates: [{value: 2, indexes: [1, 2]}]},
            }],
        ],
        // invalid: multiple duplicate values
        [
            {uniqueItems: true},
            [1, 2, 1, 3, 2],
            false,
            1,
            [{
                error: ERROR_DUPLICATE_ITEMS,
                keywordLocation: '/uniqueItems',
                instanceLocation: '',
                context: {
                    duplicates: [
                        {value: 1, indexes: [0, 2]},
                        {value: 2, indexes: [1, 4]},
                    ],
                },
            }],
        ],
        // valid: uniqueItems is false
        [
            {uniqueItems: false},
            [2, 2],
            true,
            0,
            undefined,
        ],
        // valid: uniqueItems is not present
        [
            {},
            [2, 2],
            true,
            0,
            undefined,
        ],
        // valid: immutable list with unique items
        [
            {uniqueItems: true},
            List([1, 2, 3]),
            true,
            0,
            undefined,
        ],
        // invalid: immutable list with duplicate items
        [
            {uniqueItems: true},
            List([1, 2, 2]),
            false,
            1,
            [{
                error: ERROR_DUPLICATE_ITEMS,
                keywordLocation: '/uniqueItems',
                instanceLocation: '',
                context: {duplicates: [{value: 2, indexes: [1, 2]}]},
            }],
        ],
        // valid: empty array
        [
            {uniqueItems: true},
            [],
            true,
            0,
            undefined,
        ],
    ])('validateUniqueItems(%j, %j)', (schema, value, expected, expectedErrCount, expectedErrors) => {
        const state = newMockState()
        const unique = validateUniqueItems(createOrderedMap(schema), value, {...makeParams(), ...state})
        expect(unique).toBe(expected)
        expect(state.output.errCount).toBe(expectedErrCount)
        if (expectedErrors) {
            const simplifiedErrors = state.output.errors.map(e => ({
                error: e.error,
                keywordLocation: e.keywordLocation,
                instanceLocation: e.instanceLocation,
                context: e.context ? {duplicates: e.context['duplicates']} : undefined,
            }))
            expect(simplifiedErrors).toMatchObject(expectedErrors)
        }
    })
})

describe('validateContains', () => {
    test.each<[any, List<unknown> | unknown[], number, any[] | undefined]>([
        // valid cases
        [{contains: {type: 'number'}}, [1, 'a'], 0, undefined],
        [{contains: {type: 'number'}}, List([1, 'a']), 0, undefined],
        [{contains: {type: 'number'}, minContains: 2}, [1, 2, 'a'], 0, undefined],
        [{contains: {type: 'number'}, maxContains: 2}, [1, 2, 'a'], 0, undefined],
        [{contains: {type: 'number'}, minContains: 1, maxContains: 2}, [1, 2, 'a'], 0, undefined],
        [{contains: {type: 'boolean'}}, [1, 2, true], 0, undefined],
        [{contains: {type: 'number'}, minContains: 0}, [], 0, undefined],
        [{contains: {type: 'number'}, minContains: 2, maxContains: 4}, [1, 2], 0, undefined],
        [{contains: {type: 'number'}, minContains: 2, maxContains: 4}, [1, 2, 3], 0, undefined],
        [{contains: {type: 'number'}, minContains: 2, maxContains: 4}, [1, 2, 3, 4], 0, undefined],
        [{contains: {type: 'number'}, maxContains: 2}, [1, 2], 0, undefined],
        [{contains: {type: 'number'}, minContains: 0, maxContains: 1}, [], 0, undefined],

        // invalid cases
        [
            {contains: {type: 'number'}},
            ['a', 'b'],
            1,
            [{error: ERROR_NOT_FOUND_CONTAINS, keywordLocation: '/contains', context: {minContains: 1, found: 0}}],
        ],
        [
            {contains: {type: 'number'}},
            [],
            1,
            [{error: ERROR_NOT_FOUND_CONTAINS, keywordLocation: '/contains', context: {minContains: 1, found: 0}}],
        ],
        [
            {contains: {type: 'number'}, minContains: 2},
            [1, 'a', 'b'],
            1,
            [{error: ERROR_MIN_CONTAINS, keywordLocation: '/minContains', context: {minContains: 2, found: 1}}],
        ],
        [
            {contains: {type: 'number'}, maxContains: 1},
            [1, 2, 'a'],
            1,
            [{error: ERROR_MAX_CONTAINS, keywordLocation: '/maxContains', context: {maxContains: 1, found: 2}}],
        ],
        [{
            contains: {type: 'number'},
            minContains: 2,
        }, [1], 1, [{error: ERROR_MIN_CONTAINS, keywordLocation: '/minContains'}]],
        [{
            contains: {type: 'number'},
            minContains: 2,
            maxContains: 4,
        }, [1], 1, [{error: ERROR_MIN_CONTAINS, keywordLocation: '/minContains'}]],
        [{
            contains: {type: 'number'},
            minContains: 2,
            maxContains: 4,
        }, [1, 2, 3, 4, 5], 1, [{error: ERROR_MAX_CONTAINS, keywordLocation: '/maxContains'}]],
        [{
            contains: {type: 'number'},
            maxContains: 2,
        }, [1, 2, 3], 1, [{error: ERROR_MAX_CONTAINS, keywordLocation: '/maxContains'}]],
        [
            {contains: {type: 'number'}},
            List([]),
            1,
            [{error: ERROR_NOT_FOUND_CONTAINS, keywordLocation: '/contains'}],
        ],

        // edge cases
        [{}, [1, 2], 0, undefined], // no `contains` keyword
        [{contains: true}, [1, 2], 0, undefined], // `contains` must be a schema object
        [{contains: {}}, [1, 2], 0, undefined], // empty schema, always matches
    ])('validateContains(%j, %j)', (schema, value, expectedErrCount, expectedErrors) => {
        const state = newMockState()
        validateContains(createOrderedMap(schema), value, {...makeParams(), ...state})
        expect(state.output.errCount).toBe(expectedErrCount)
        if (expectedErrors) {
            const simplifiedErrors = state.output.errors.map(e => ({
                error: e.error,
                keywordLocation: e.keywordLocation,
                context: e.context ? {minContains: e.context['minContains'], maxContains: e.context['maxContains'], found: e.context['found']} : undefined,
            }))
            expect(simplifiedErrors).toMatchObject(expectedErrors)
        }
    })
})

describe('validateItems', () => {
    test.each<[any, List<unknown> | unknown[], number, any[] | undefined]>([
        // Homogeneous items (default `items` keyword)
        [{items: {type: 'string'}}, ['a', 'b'], 0, undefined],
        [{items: {type: 'string'}}, ['a', 123], 1, [{error: ERROR_WRONG_TYPE, keywordLocation: '/items/type', instanceLocation: '/1'}]],
        [{items: {type: 'string'}}, List(['a', 123]), 1, [{error: ERROR_WRONG_TYPE, keywordLocation: '/items/type', instanceLocation: '/1'}]],
        // `items: false` (no items allowed)
        [{items: false}, [], 0, undefined],
        [{items: false}, [1], 1, [{error: ERROR_ADDITIONAL_ITEMS, keywordLocation: '/items', instanceLocation: '/0'}]],

        // Draft-07 Style: `items` as array (tuple), `additionalItems`
        [{items: [{type: 'string'}, {type: 'number'}]}, ['a', 1], 0, undefined],
        [{items: [{type: 'string'}, {type: 'number'}]}, ['a', '1'], 1, [{error: ERROR_WRONG_TYPE, keywordLocation: '/items/1/type', instanceLocation: '/1'}]],
        [{items: [{type: 'string'}, {type: 'number'}]}, [1, 'a'], 2, [
            {error: ERROR_WRONG_TYPE, keywordLocation: '/items/0/type', instanceLocation: '/0'},
            {error: ERROR_WRONG_TYPE, keywordLocation: '/items/1/type', instanceLocation: '/1'},
        ]],
        [{items: [{type: 'string'}], additionalItems: false}, ['a'], 0, undefined],
        [{items: [{type: 'string'}], additionalItems: false}, ['a', 1], 1, [{error: ERROR_ADDITIONAL_ITEMS, keywordLocation: '/additionalItems', instanceLocation: '/1'}]],
        [{items: [{type: 'string'}], additionalItems: {type: 'number'}}, ['a', 1, 2], 0, undefined],
        [{items: [{type: 'string'}], additionalItems: {type: 'number'}}, ['a', 1, '2'], 1, [{error: ERROR_WRONG_TYPE, keywordLocation: '/items/type', instanceLocation: '/2'}]],
        [{items: [], additionalItems: false}, [], 0, undefined],
        [{items: [], additionalItems: false}, [1], 1, [{error: ERROR_ADDITIONAL_ITEMS, keywordLocation: '/additionalItems', instanceLocation: '/0'}]],

        // Draft-2019-09 Style: `prefixItems`, `items`
        [{prefixItems: [{type: 'string'}, {type: 'number'}]}, ['a', 1], 0, undefined],
        [{prefixItems: [{type: 'string'}, {type: 'number'}]}, ['a', '1'], 1, [{error: ERROR_WRONG_TYPE, keywordLocation: '/prefixItems/1/type', instanceLocation: '/1'}]],
        [{prefixItems: [{type: 'string'}], items: false}, ['a'], 0, undefined],
        [{prefixItems: [{type: 'string'}], items: false}, ['a', 1], 1, [{error: ERROR_ADDITIONAL_ITEMS, keywordLocation: '/items', instanceLocation: '/1'}]],
        [{prefixItems: [{type: 'string'}], items: {type: 'number'}}, ['a', 1, 2], 0, undefined],
        [{prefixItems: [{type: 'string'}], items: {type: 'number'}}, ['a', 1, '2'], 1, [{error: ERROR_WRONG_TYPE, keywordLocation: '/items/type', instanceLocation: '/2'}]],
        [{prefixItems: []}, [1, 'a'], 0, undefined], // `items` is not defined, so additional items are allowed
        [{prefixItems: [], items: {type: 'number'}}, [1, 2], 0, undefined],
        [{prefixItems: [], items: {type: 'number'}}, [1, 'a'], 1, [{error: ERROR_WRONG_TYPE, keywordLocation: '/items/type', instanceLocation: '/1'}]],
        [{prefixItems: [], items: false}, [1], 1, [{error: ERROR_ADDITIONAL_ITEMS, keywordLocation: '/items', instanceLocation: '/0'}]],
    ])('validateItems(%j, %j)', (schema, value, expectedErrCount, expectedErrors) => {
        const state = newMockState()
        validateItems(createOrderedMap(schema), value, {...makeParams(), ...state, recursive: true})
        expect(state.output.errCount).toBe(expectedErrCount)
        if (expectedErrors) {
            const simplifiedErrors = state.output.errors.map(e => ({
                error: e.error,
                keywordLocation: e.keywordLocation,
                instanceLocation: e.instanceLocation,
            }))
            expect(simplifiedErrors).toMatchObject(expectedErrors)
        }
    })
})

describe('arrayValidator', () => {
    test.each<[any, unknown, number, any[] | undefined, { recursive?: boolean } | undefined]>([
        // items (recursive: false by default)
        [{items: {type: 'number'}}, ['1'], 0, undefined, {recursive: false}],
        [{items: {type: 'number'}}, [1, 2], 0, undefined, {recursive: false}],

        // items (recursive: true)
        [{items: {type: 'number'}}, [1, '2'], 1, [{error: ERROR_WRONG_TYPE, keywordLocation: '/items/type', instanceLocation: '/1'}], {recursive: true}],
        [{items: [{type: 'string'}], additionalItems: false}, ['a', 1], 1, [{error: ERROR_ADDITIONAL_ITEMS, keywordLocation: '/additionalItems', instanceLocation: '/1'}], {recursive: true}],
        [{prefixItems: [{type: 'string'}], items: false}, ['a', 1], 1, [{error: ERROR_ADDITIONAL_ITEMS, keywordLocation: '/items', instanceLocation: '/1'}], {recursive: true}],

        // non-array value should be skipped by the validator
        [{items: {type: 'number'}}, null, 0, undefined, undefined],
        [{items: {type: 'number'}}, undefined, 0, undefined, undefined],
        [{items: {type: 'string'}}, {}, 0, undefined, undefined],

        [
            {items: {type: 'number'}},
            List(['1', '2', 3]),
            2,
            [
                {error: ERROR_WRONG_TYPE, instanceLocation: '/0'},
                {error: ERROR_WRONG_TYPE, instanceLocation: '/1'},
            ],
            {recursive: true},
        ],
        [
            {items: [{type: 'number'}, {type: 'number'}, {type: 'number'}], additionalItems: false},
            ['no-tuple', 3, 'no-tuple'],
            2,
            [
                {error: ERROR_WRONG_TYPE, instanceLocation: '/0'},
                {error: ERROR_WRONG_TYPE, instanceLocation: '/2'},
            ],
            {recursive: true},
        ],
        [
            {items: [{type: 'number'}, {type: 'number'}, {type: 'number'}], additionalItems: false},
            [1, 2, 3, 4],
            1,
            [{error: ERROR_ADDITIONAL_ITEMS, instanceLocation: '/3'}],
            {recursive: true},
        ],
    ])(
        'arrayValidator.validate(%j, %s, recursive: %j)',
        (schema, value, expectedErrCount, expectedErrors, params) => {
            const state = newMockState()
            const finalParams = {...makeParams(), ...(params || {}), ...state}
            arrayItemsValidator.validate(
                createOrderedMap(schema),
                value,
                finalParams,
            )
            expect(state.output.errCount).toBe(expectedErrCount)
            if (expectedErrors) {
                const simplifiedErrors = state.output.errors.map(e => ({
                    error: e.error,
                    keywordLocation: e.keywordLocation,
                    instanceLocation: e.instanceLocation || '', // normalize for comparison
                }))
                expect(simplifiedErrors).toMatchObject(expectedErrors)
            }
        },
    )
})
