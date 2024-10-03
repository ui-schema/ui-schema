/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals'
import '@testing-library/jest-dom/jest-globals'
import { List, Map } from 'immutable'
import { UIStore, StoreKeys, UIStoreType } from '@ui-schema/react/UIStore/UIStore'
import { scopeUpdaterInternals } from '@ui-schema/react/storeScopeUpdater/scopeUpdaterInternals'

/**
 * npm run tdd -- -u --testPathPattern=src/storeScopeUpdater/scopeUpdaterInternals.test.tsx
 */

describe('scopeUpdaterInternals', () => {
    test.each([
        [
            new UIStore({
                internals: Map({}),
            }),
            List([]),
            undefined,
            //Map({}),
            new UIStore({
                internals: Map({}),
            }),
        ], [
            new UIStore({
                internals: Map({}),
            }),
            List([]),
            Map({
                value: 'some-state',
                internals: Map({}),
            }),
            //Map({}),
            new UIStore({
                internals: Map({
                    value: 'some-state',
                    internals: Map({}),
                }),
            }),
        ], [
            new UIStore({
                internals: Map({}),
            }),
            List([]),
            Map({
                value: 'some-state',
                internals: Map({}),
            }),
            //Map({}),
            new UIStore({
                internals: Map({
                    value: 'some-state',
                    internals: Map({}),
                }),
            }),
        ], [
            new UIStore({
                internals: Map({}),
            }),
            List(['prop_a']),
            Map({
                value: 'some-state',
            }),
            new UIStore({
                internals: Map({
                    internals: Map({
                        prop_a: Map({
                            value: 'some-state',
                        }),
                    }),
                }),
            }),
        ], [
            new UIStore({
                internals: Map({}),
            }),
            List(['prop_a']),
            Map({
                value: 'some-state',
            }),
            new UIStore({
                internals: Map({
                    internals: Map({
                        prop_a: Map({
                            value: 'some-state',
                        }),
                    }),
                }),
            }),
        ], [
            new UIStore({
                internals: Map({}),
            }),
            List(['prop_a', 0]),
            Map({
                value: 'some-state',
            }),
            new UIStore({
                internals: Map({
                    internals: Map({
                        prop_a: Map({
                            internals: List([
                                Map({
                                    value: 'some-state',
                                }),
                            ]),
                        }),
                    }),
                }),
            }),
        ], [
            new UIStore({
                internals: Map({}),
            }),
            List(['prop_a', 0, 'sub_a']),
            Map({
                value: 'some-state',
            }),
            new UIStore({
                internals: Map({
                    internals: Map({
                        prop_a: Map({
                            internals: List([
                                Map({
                                    internals: Map({
                                        sub_a: Map({
                                            value: 'some-state',
                                        }),
                                    }),
                                }),
                            ]),
                        }),
                    }),
                }),
            }),
        ], [
            new UIStore({
                internals: Map({
                    internals: Map({
                        prop_a: Map({
                            internals: List([
                                Map({
                                    internals: Map({}),
                                }),
                            ]),
                        }),
                    }),
                }),
            }),
            List(['prop_a', 0, 'sub_a']),
            Map({
                value: 'some-state',
            }),
            new UIStore({
                internals: Map({
                    internals: Map({
                        prop_a: Map({
                            internals: List([
                                Map({
                                    internals: Map({
                                        sub_a: Map({
                                            value: 'some-state',
                                        }),
                                    }),
                                }),
                            ]),
                        }),
                    }),
                }),
            }),
        ],
        [
            new UIStore({
                internals: Map({
                    internals: Map({
                        prop_a: Map({
                            internals: List([
                                Map({
                                    internals: Map({
                                        sub_a: Map({}),
                                    }),
                                }),
                            ]),
                        }),
                    }),
                }),
            }),
            List(['prop_a', 0, 'sub_a']),
            Map({
                value: 'some-state',
            }),
            new UIStore({
                internals: Map({
                    internals: Map({
                        prop_a: Map({
                            internals: List([
                                Map({
                                    internals: Map({
                                        sub_a: Map({
                                            value: 'some-state',
                                        }),
                                    }),
                                }),
                            ]),
                        }),
                    }),
                }),
            }),
        ],
    ])('scopeUpdaterInternals(%j, %s, %j): %j', <S extends UIStoreType>(
        store: S, storeKeys: StoreKeys,
        newValue: any,
        expected: any
    ) => {
        const r = scopeUpdaterInternals(store, storeKeys, newValue)
        const isExpected = r.equals(expected)
        if (!isExpected) {
            // @ts-ignore
            console.log('failed storeBuildScopeTree', storeKeys.toJS(), store.toJS(), r?.toJS(), expected?.toJS())
        }
        expect(isExpected).toBe(true)
    })
})
