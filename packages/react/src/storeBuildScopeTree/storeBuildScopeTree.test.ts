/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals'
import { List, Map, OrderedMap } from 'immutable'
import { UIStore, StoreKeys, UIStoreType, UIStoreStateData } from '@ui-schema/react/UIStore'
import { storeBuildScopeTree } from './storeBuildScopeTree.js'

/**
 * npm run tdd -- --testPathPattern=src/storeBuildScopeTree/storeBuildScopeTree.test.ts --selectProjects=test-@ui-schema/react
 */

// const initialStore = UIStore({
//     values: OrderedMap({}),
//     internals: Map({
//         self: undefined,
//         internals: Map({}),
//     }),
//     validity: Map({
//         valid: null,
//         self: Map({}),
//         validity: Map({}),
//     }),
// })
//
// const partialStore = UIStore({
//     values: undefined,
//     internals: Map({
//         self: undefined,
//         // internals: Map({}),
//     }),
//     validity: undefined,
// })

const emptyStore = UIStore({
    values: undefined,
    internals: undefined,
    validity: undefined,
})

describe('storeBuildScopeTree', () => {
    test.each([
        {
            storeKeys: List(['a']),
            scope: 'values' as const,
            store: emptyStore,
            onMiss: (key) => typeof key === 'number' ? List() : OrderedMap(),
            expected: UIStore({
                values: OrderedMap({}),
                internals: undefined,
                validity: undefined,
            }),
            expectedSameness: true,
        },
        {
            storeKeys: List([]),
            scope: 'internals' as const,
            store: emptyStore,
            onMiss: (key) => typeof key === 'number' ? List() : Map(),
            onMissWrapper: () => Map({self: Map()}),
            expected: new UIStore({
                values: undefined,
                internals: Map({self: Map()}),
                validity: undefined,
            }),
            expectedSameness: true,
        },
        {
            storeKeys: List(['a']),
            scope: 'internals' as const,
            store: emptyStore,
            onMissWrapper: () => Map({self: Map()}),
            onMiss: (key) => typeof key === 'number' ? List() : Map(),
            expected: new UIStore({
                values: undefined,
                internals: Map({
                    self: Map(),
                    children: Map({}),
                }),
                validity: undefined,
            }),
            expectedSameness: true,
        },
        {
            storeKeys: List(['a', 'b']),
            scope: 'internals' as const,
            store: emptyStore,
            onMiss: (key) => typeof key === 'number' ? List() : Map(),
            onMissWrapper: () => Map({self: Map()}),
            expected: new UIStore({
                values: undefined,
                internals: Map({
                    self: Map(),
                    children: Map({
                        a: Map({
                            self: Map(),
                            children: Map({}),
                        }),
                    }),
                }),
                validity: undefined,
            }),
            expectedSameness: true,
        },
    ])('$# storeBuildScopeTree($storeKeys, $scope, ..., ..., ...)', (
        args: {
            storeKeys: StoreKeys
            scope: keyof UIStoreStateData
            store: UIStoreType
            onMiss: (key: string | number) => any
            onMissWrapper?: () => Map<unknown, unknown> | OrderedMap<unknown, unknown>
            expected: UIStoreType
            expectedSameness: boolean
        },
    ) => {
        const store = storeBuildScopeTree(
            args.storeKeys, args.scope,
            args.store,
            args.onMiss,
            args.onMissWrapper,
        )
        const isExpected = store.store.equals(args.expected)
        if (isExpected !== args.expectedSameness) {
            console.log(
                'failed storeBuildScopeTree',
                args.storeKeys.toJS(), args.scope,
                // JSON.stringify(args.store, undefined, 2),
                JSON.stringify(store.store, undefined, 2),
            )
        }
        expect(isExpected).toBe(args.expectedSameness)
    })
})
