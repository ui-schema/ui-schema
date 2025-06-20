/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals'
import { List, Map, OrderedMap } from 'immutable'
import { StoreKeys } from '@ui-schema/react/UIStore'
import { buildTree } from './buildTree.js'

/**
 * npm run tdd -- --testPathPattern=src/storeBuildScopeTree/buildTree.test.ts --selectProjects=test-@ui-schema/react
 */

describe('buildTree', () => {
    test.each([
        {
            storeKeys: List([]),
            value: undefined,
            onMiss: (key) => typeof key === 'number' ? List() : OrderedMap(),
            expected: undefined,
        },
        {
            storeKeys: List(['a']),
            value: undefined,
            onMiss: (key) => typeof key === 'number' ? List() : OrderedMap(),
            expected: OrderedMap(),
        },
        {
            storeKeys: List([0]),
            value: undefined,
            onMiss: (key) => typeof key === 'number' ? List() : OrderedMap(),
            expected: List(),
        },
        {
            storeKeys: List(['a', 0]),
            value: undefined,
            onMiss: (key) => typeof key === 'number' ? List() : OrderedMap(),
            expected: OrderedMap({a: List()}),
        },
        {
            storeKeys: List([0, 'a']),
            value: undefined,
            onMiss: (key) => typeof key === 'number' ? List() : OrderedMap(),
            expected: List([OrderedMap()]),
        },
    ])('$# buildTree($storeKeys, ..., ...)', (
        args: {
            storeKeys: StoreKeys
            value: List<unknown> | Map<unknown, unknown> | OrderedMap<unknown, unknown> | undefined
            onMiss: (key: string | number) => any
            expected: List<unknown> | Map<unknown, unknown> | OrderedMap<unknown, unknown> | undefined
        },
    ) => {
        const r = buildTree(args.storeKeys, args.value, args.onMiss)
        const isExpected = r ? r.equals(args.expected) : r === args.expected
        if (!isExpected) {
            console.log(
                'failed buildTree',
                args.storeKeys.toJS(),
                JSON.stringify(r, undefined, 2),
            )
        }
        expect(isExpected).toBe(true)
    })
})
