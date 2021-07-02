/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals'
import {
    toBeInTheDocument,
    toHaveClass,
    // @ts-ignore
} from '@testing-library/jest-dom/matchers'
import { List, Map } from 'immutable'
import { UIStore, StoreKeys, UIStoreType } from '@ui-schema/ui-schema/UIStore/UIStore'
import { scopeUpdaterInternals } from '@ui-schema/ui-schema/UIStore/scopeUpdaterInternals'

expect.extend({toBeInTheDocument, toHaveClass})

describe('scopeUpdaterInternals', () => {
    test.each([
        [
            new UIStore({
                internals: Map({}),
            }),
            List([]),
            undefined,
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
                internals: Map({}),
            }),
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
                internals: Map({}),
            }),
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
            undefined,
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
            Map({}),
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
            undefined,
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
            undefined,
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
            undefined,
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
            Map({}),
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
        oldValue: any, newValue: any,
        expected: any
    ) => {
        const r = scopeUpdaterInternals(store, storeKeys, oldValue, newValue)
        const isExpected = r.equals(expected)
        if (!isExpected) {
            // @ts-ignore
            console.log('failed storeBuildScopeTree', storeKeys.toJS(), store.toJS(), r?.toJS(), expected?.toJS())
        }
        expect(isExpected).toBe(true)
    })
})
