/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals'
import { List, Map, OrderedMap } from 'immutable'
import { StoreKeys } from '@ui-schema/react/UIStore'
import { buildScopeTree } from './buildScopeTree.js'

/**
 * npm run tdd -- --testPathPattern=src/storeBuildScopeTree/buildScopeTree.test.ts --selectProjects=test-@ui-schema/react
 */

describe('buildScopeTree', () => {
    test.each([
        {
            storeKeys: List([]),
            value: undefined,
            onMissWrapper: () => Map(),
            onMiss: (key) => typeof key === 'number' ? List() : OrderedMap(),
            expected: undefined,
        },
        {
            storeKeys: List(['a']),
            value: undefined,
            onMissWrapper: () => Map(),
            onMiss: (key) => typeof key === 'number' ? List() : OrderedMap(),
            expected: Map({children: OrderedMap()}),
        },
        {
            storeKeys: List([0]),
            value: undefined,
            onMissWrapper: () => Map(),
            onMiss: (key) => typeof key === 'number' ? List() : OrderedMap(),
            expected: Map({children: List()}),
        },
        {
            storeKeys: List(['a', 'b']),
            value: undefined,
            onMissWrapper: () => Map(),
            onMiss: (key) => typeof key === 'number' ? List() : OrderedMap(),
            expected: Map({
                children: OrderedMap({
                    a: Map({
                        children: OrderedMap(),
                    }),
                }),
            }),
        },
        {
            storeKeys: List(['a', 0]),
            value: undefined,
            onMissWrapper: () => Map(),
            onMiss: (key) => typeof key === 'number' ? List() : OrderedMap(),
            expected: Map({
                children: OrderedMap({
                    a: Map({
                        children: List(),
                    }),
                }),
            }),
        },
        {
            storeKeys: List([0, 'a']),
            value: undefined,
            onMissWrapper: () => Map(),
            onMiss: (key) => typeof key === 'number' ? List() : OrderedMap(),
            expected: Map({
                children: List([
                    Map({
                        children: OrderedMap({}),
                    }),
                ]),
            }),
        },
        {
            storeKeys: List(['a', 0, 'b']),
            value: undefined,
            onMissWrapper: () => Map(),
            onMiss: (key) => typeof key === 'number' ? List() : OrderedMap(),
            expected: Map({
                children: OrderedMap({
                    a: Map({
                        children: List([
                            Map({
                                children: OrderedMap({}),
                            }),
                        ]),
                    }),
                }),
            }),
        },
        {
            storeKeys: List(['a', 0, 'b', 'c']),
            value: undefined,
            onMissWrapper: () => Map(),
            onMiss: (key) => typeof key === 'number' ? List() : OrderedMap(),
            expected: Map({
                children: OrderedMap({
                    a: Map({
                        children: List([
                            Map({
                                children: OrderedMap({
                                    b: Map({
                                        children: OrderedMap({}),
                                    }),
                                }),
                            }),
                        ]),
                    }),
                }),
            }),
        },
        {
            storeKeys: List(['a', 'b', 'c']),
            value: undefined,
            onMissWrapper: () => Map(),
            onMiss: (key) => typeof key === 'number' ? List() : OrderedMap(),
            expected: Map({
                children: OrderedMap({
                    a: Map({
                        children: OrderedMap({
                            b: Map({
                                children: OrderedMap({}),
                            }),
                        }),
                    }),
                }),
            }),
        },
        {
            storeKeys: List(['a', 'b', 'c']),
            value: undefined,
            onMissWrapper: () => Map({self: Map()}),
            onMiss: (key) => typeof key === 'number' ? List() : OrderedMap(),
            expected: Map({
                self: Map(),
                children: OrderedMap({
                    a: Map({
                        self: Map(),
                        children: OrderedMap({
                            b: Map({
                                self: Map(),
                                children: OrderedMap({}),
                            }),
                        }),
                    }),
                }),
            }),
        },
        {
            storeKeys: List(['a']),
            value: Map({
                self: Map({exists: true}),
            }),
            onMissWrapper: () => Map({self: Map()}),
            onMiss: (key) => typeof key === 'number' ? List() : OrderedMap(),
            expected: Map({
                self: Map({exists: true}),
                children: OrderedMap({}),
            }),
        },
        {
            storeKeys: List(['a', 'b']),
            value: Map({
                self: Map({exists: 10}),
                other: true,
                children: OrderedMap({
                    a: Map({
                        self: Map({exists: 11}),
                    }),
                }),
            }),
            onMissWrapper: () => Map({self: Map()}),
            onMiss: (key) => typeof key === 'number' ? List() : OrderedMap(),
            expected: Map({
                self: Map({exists: 10}),
                other: true,
                children: OrderedMap({
                    a: Map({
                        self: Map({exists: 11}),
                        children: OrderedMap({}),
                    }),
                }),
            }),
        },
    ])('$# buildScopeTree($storeKeys, ..., ...)', (
        args: {
            storeKeys: StoreKeys
            value: List<unknown> | Map<unknown, unknown> | OrderedMap<unknown, unknown> | undefined
            onMissWrapper: () => Map<unknown, unknown> | OrderedMap<unknown, unknown>
            onMiss: (key: string | number) => any
            expected: List<unknown> | Map<unknown, unknown> | OrderedMap<unknown, unknown> | undefined
        },
    ) => {
        const r = buildScopeTree(args.storeKeys, args.value, args.onMiss, args.onMissWrapper)
        const isExpected = r.root ? r.root.equals(args.expected) : r.root === args.expected
        if (!isExpected) {
            console.log(
                'failed buildScopeTree',
                args.storeKeys.toJS(),
                JSON.stringify(r, undefined, 2),
            )
        }
        expect(isExpected).toBe(true)
    })
})
