/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals'
import '@testing-library/jest-dom/jest-globals'
import { List, Map } from 'immutable'
import { UIStore, StoreKeys, UIStoreType } from '@ui-schema/react/UIStore'
import { scopeUpdaterInternals } from './scopeUpdaterInternals.js'

/**
 * npm run tdd -- --testPathPattern=src/storeScopeUpdater/scopeUpdaterInternals.test.tsx
 */

describe('scopeUpdaterInternals', () => {
    test.each([
        [
            new UIStore({}),
            List([]),
            undefined,
            new UIStore({
                internals: Map({self: undefined}),
            }),
        ],
        [
            new UIStore({
                internals: Map({}),
            }),
            List([]),
            Map({
                value: 'some-state',
            }),
            new UIStore({
                internals: Map({
                    self: Map({value: 'some-state'}),
                }),
            }),
        ],
        [
            new UIStore({
                internals: Map({}),
            }),
            List([]),
            Map({
                value: 'some-state',
            }),
            new UIStore({
                internals: Map({
                    self: Map({
                        value: 'some-state',
                    }),
                }),
            }),
        ],
        [
            new UIStore({
                internals: Map({}),
            }),
            List(['prop_a']),
            Map({
                value: 'some-state',
            }),
            new UIStore({
                internals: Map({
                    children: Map({
                        prop_a: Map({
                            self: Map({
                                value: 'some-state',
                            }),
                        }),
                    }),
                }),
            }),
        ],
        [
            new UIStore({
                internals: Map({}),
            }),
            List(['prop_a']),
            Map({
                value: 'some-state',
            }),
            new UIStore({
                internals: Map({
                    children: Map({
                        prop_a: Map({
                            self: Map({
                                value: 'some-state',
                            }),
                        }),
                    }),
                }),
            }),
        ],
        [
            new UIStore({
                internals: Map({}),
            }),
            List(['prop_a', 0]),
            Map({
                value: 'some-state',
            }),
            new UIStore({
                internals: Map({
                    children: Map({
                        prop_a: Map({
                            self: Map({}),
                            children: List([
                                Map({
                                    self: Map({value: 'some-state'}),
                                }),
                            ]),
                        }),
                    }),
                }),
            }),
        ],
        [
            new UIStore({
                internals: Map({}),
            }),
            List(['prop_a', 0, 'sub_a']),
            Map({
                value: 'some-state',
            }),
            new UIStore({
                internals: Map({
                    children: Map({
                        prop_a: Map({
                            self: Map({}),
                            children: List([
                                Map({
                                    self: Map({}),
                                    children: Map({
                                        sub_a: Map({
                                            self: Map({
                                                value: 'some-state',
                                            }),
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
                    children: Map({
                        prop_a: Map({
                            children: List([
                                Map({
                                    children: Map({}),
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
                    children: Map({
                        prop_a: Map({
                            children: List([
                                Map({
                                    children: Map({
                                        sub_a: Map({
                                            self: Map({
                                                value: 'some-state',
                                            }),
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
                    children: Map({
                        prop_a: Map({
                            children: List([
                                Map({
                                    children: Map({
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
                    children: Map({
                        prop_a: Map({
                            children: List([
                                Map({
                                    children: Map({
                                        sub_a: Map({
                                            self: Map({
                                                value: 'some-state',
                                            }),
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
        expected: any,
    ) => {
        const r = scopeUpdaterInternals(store, storeKeys, newValue)
        const isExpected = r.equals(expected)
        if (!isExpected) {
            console.log(
                'failed scopeUpdaterInternals',
                storeKeys.toJS(),
                // JSON.stringify(store, undefined, 2),
                JSON.stringify(r, undefined, 2),
                // JSON.stringify(expected, undefined, 2),
            )
        }
        expect(isExpected).toBe(true)
    })
})
