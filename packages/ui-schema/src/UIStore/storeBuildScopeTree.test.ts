/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals'
import {
    toBeInTheDocument,
    toHaveClass,
    // @ts-ignore
} from '@testing-library/jest-dom/matchers'
import { List, Map, OrderedMap } from 'immutable'
import { UIStore, createStore, StoreKeys, UIStoreType } from '@ui-schema/ui-schema/UIStore/UIStore'
import { storeBuildScopeTree } from '@ui-schema/ui-schema/UIStore/storeBuildScopeTree'

expect.extend({toBeInTheDocument, toHaveClass})

describe('storeBuildScopeTree', () => {
    test.each([
        [
            List([]),
            'internals',
            createStore(Map({})),
            'internals',
            false,
            new UIStore({
                values: Map({}),
                internals: Map({
                    internals: Map({}),
                }),
                validity: Map({}),
            }),
            true,
        ], [
            List([]),
            'internals',
            new UIStore({
                values: Map({}),
                internals: Map({
                    internals: Map({}),
                }),
                validity: Map({}),
            }),
            'internals',
            false,
            new UIStore({
                values: Map({}),
                internals: Map({
                    internals: Map({}),
                }),
                validity: Map({}),
            }),
            true,
        ], [
            List([]),
            'values',
            new UIStore({
                values: Map({}),
                internals: undefined,
                validity: Map({}),
            }),
            undefined,
            false,
            new UIStore({
                values: Map({}),
                internals: undefined,
                validity: Map({}),
            }),
            true,
        ], [
            List([]),
            'internals',
            new UIStore({
                values: Map({}),
                internals: undefined,
                validity: Map({}),
            }),
            'internals',
            false,
            new UIStore({
                values: Map({}),
                internals: Map({}),
                validity: Map({}),
            }),
            true,
        ], [
            List(['prop_a', 'prop_a0']),
            'internals',
            new UIStore({
                values: Map({}),
                internals: undefined,
                validity: Map({}),
            }),
            'internals',
            false,
            new UIStore({
                values: Map({}),
                internals: Map({
                    internals: Map({
                        prop_a: Map({
                            internals: Map({}),
                        }),
                    }),
                }),
                validity: Map({}),
            }),
            true,
        ], [
            List(['prop_a', 0, 'sub_a']),
            'internals',
            new UIStore({
                values: Map({}),
                internals: undefined,
                validity: Map({}),
            }),
            'internals',
            false,
            new UIStore({
                values: Map({}),
                internals: Map({
                    internals: Map({
                        prop_a: Map({
                            internals: List([
                                Map({internals: Map({})}),
                            ]),
                        }),
                    }),
                }),
                validity: Map({}),
            }),
            true,
        ], [
            List(['prop_a', 0, 'sub_a']),
            'internals',
            new UIStore({
                values: Map({}),
                internals: Map({
                    internals: Map({
                        prop_a: Map({
                            // invalid `Map`, where a `List` is expected - according to storeKeys
                            internals: Map({
                                '0': Map({internals: Map({})}),
                            }),
                        }),
                    }),
                }),
                validity: Map({}),
            }),
            'internals',
            false,
            new UIStore({
                values: Map({}),
                internals: Map({
                    internals: Map({
                        prop_a: Map({
                            internals: List([
                                Map({internals: Map({})}),
                            ]),
                        }),
                    }),
                }),
                validity: Map({}),
            }),
            true,
        ], [
            List(['prop_a']),
            'values',
            new UIStore({
                values: Map({}),
                internals: undefined,
                validity: Map({}),
            }),
            undefined,
            true,
            new UIStore({
                values: Map({}),
                internals: undefined,
                validity: Map({}),
            }),
            true,
        ], [
            List(['prop_a', 0]),
            'values',
            new UIStore({
                values: Map({}),
                internals: undefined,
                validity: Map({}),
            }),
            undefined,
            true,
            new UIStore({
                values: Map({prop_a: List()}),
                internals: undefined,
                validity: Map({}),
            }),
            true,
        ], [
            List(['prop_a', 0, 'sub_a']),
            'values',
            new UIStore({
                values: Map({}),
                internals: undefined,
                validity: Map({}),
            }),
            undefined,
            true,
            new UIStore({
                values: Map({
                    prop_a: List([
                        OrderedMap({}),
                    ]),
                }),
                internals: undefined,
                validity: Map({}),
            }),
            true,
        ],
    ])('storeBuildScopeTree(%j, %s, %j): %j', (storeKeys: StoreKeys, scope: string, store: UIStoreType, nestKey: string | undefined, ordered: boolean, expected: UIStoreType, expectedSameness: boolean) => {
        const r = storeBuildScopeTree(storeKeys, scope, store, nestKey, ordered)
        const isExpected = r.equals(expected)
        if (isExpected !== expectedSameness) {
            // @ts-ignore
            console.log('failed storeBuildScopeTree', storeKeys.toJS(), store.toJS(), r?.getIn(['internals'])?.toJS(), expected?.toJS())
        }
        expect(isExpected).toBe(expectedSameness)
    })
})
