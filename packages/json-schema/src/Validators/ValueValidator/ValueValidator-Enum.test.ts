import { test, expect, describe } from '@jest/globals'
import { OrderedMap, List, Map } from 'immutable'
import { validateEnum } from '@ui-schema/json-schema/Validators/ValueValidator'

/**
 * npm run tdd -- --testPathPattern=src/Validators/ValueValidator/ValueValidator-Enum.test.ts
 */

describe('validateEnum', () => {
    test.each([
        [
            List(['text1', 'text2']),
            'text1',
            true,
        ], [
            List(['text1', 'text2']),
            'text3',
            false,
        ], [
            List(['text1', 'text2']),
            'text1',
            true,
        ], [
            List(['text1', 'text2']),
            'text3',
            false,
        ], [
            List(['text1', 'text2']),
            'text1',
            true,
        ], [
            List(['text1', 'text2']),
            'text3',
            false,
        ], [
            List([null]),
            null,
            true,
        ], [
            List([null]),
            null,
            true,
        ], [
            List(['text1', 'text2', null]),
            'text1',
            true,
        ], [
            List(['text1', 'text2', null]),
            null,
            true,
        ], [
            List(['text1', 'text2']),
            'text3',
            false,
        ], [
            ['text1', 'text2'],
            'text1',
            true,
        ], [
            ['text1', 'text2'],
            'text3',
            false,
        ], [
            List([1, 2]),
            1,
            true,
        ], [
            List([1, 2]),
            3,
            false,
        ], [
            List([1, 2]),
            1,
            true,
        ], [
            List([1, 2]),
            3,
            false,
        ], [
            List([true]),
            true,
            true,
        ], [
            List([true]),
            false,
            false,
        ], [
            List([null]),
            null,
            true,
        ], [
            List([null]),
            'null',
            false,
        ], [
            List([]),
            [],
            false,
        ], [
            [],
            [],
            false,
        ], [
            List([List([])]),
            [],
            true,
        ], [
            [[]],
            [],
            true,
        ], [
            List([List(['a', 'b']), List([1, 2])]),
            ['a', 'b'],
            true,
        ], [
            List([List(['a', 'b']), List([1, 2])]),
            ['b', 'a'],
            false,
        ], [
            List([List(['a', 'b']), List([1, 2])]),
            [1, 2],
            true,
        ], [
            List([List(['a', 'b']), List([1, 2])]),
            [2, 1],
            false,
        ], [
            [['a', 'b']],
            ['a', 'b'],
            true,
        ], [
            [['a', 'b']],
            ['b', 'a'],
            false,
        ], [
            [{}],
            {},
            true,
        ], [
            [],
            {},
            false,
        ], [
            [{a: 1}, {b: 2}],
            {a: 1},
            true,
        ], [
            [{a: 1}, {b: 2}],
            {b: 2},
            true,
        ], [
            List([OrderedMap({a: 1, b: 2}), Map({c: 3, d: 4})]),
            OrderedMap({a: 1, b: 2}),
            true,
        ], [
            // note: even when the order is correct, an `OrderedMap` can be the same as a `Map`
            List([OrderedMap({a: 1, b: 2}), Map({c: 3, d: 4})]),
            OrderedMap({c: 3, d: 4}),
            false,
        ], [
            List([OrderedMap({a: 1, b: 2}), Map({c: 3, d: 4})]),
            OrderedMap({d: 4, c: 3}),
            false,
        ], [
            List([OrderedMap({a: 1, b: 2}), Map({c: 3, d: 4})]),
            Map({c: 3, d: 4}),
            true,
        ], [
            // note: even when the order is correct, an `Map` can be the same as a `OrderedMap`
            List([OrderedMap({a: 1, b: 2}), Map({c: 3, d: 4})]),
            Map({a: 1, b: 2}),
            false,
        ], [
            List([OrderedMap({a: 1, b: 2}), Map({c: 3, d: 4})]),
            OrderedMap({b: 2, a: 1}),
            false,
        ], [
            List([OrderedMap({a: 1, b: 2}), Map({c: 3, d: 4})]),
            Map({d: 4, c: 3}),
            true,
        ],
    ])('validateEnum(%j, %j): %j', (_enum: any, value: any, expected: boolean) => {
        expect(validateEnum(_enum, value)).toBe(expected)
    })
})
