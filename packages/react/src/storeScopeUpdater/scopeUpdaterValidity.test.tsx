/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals'
import '@testing-library/jest-dom/jest-globals'
import { List, Map } from 'immutable'
import { UIStore, StoreKeys, UIStoreType } from '@ui-schema/react/UIStore'
import { scopeUpdaterValidity } from './scopeUpdaterValidity.js'

/**
 * npm run tdd -- --testPathPattern=src/storeScopeUpdater/scopeUpdaterValidity.test.tsx
 */

describe('scopeUpdaterValidity', () => {
    test.each([
        [
            new UIStore({
                validity: Map({}),
            }),
            List([]),
            false,
            new UIStore({
                validity: Map({
                    valid: false,
                    errors: null,
                }),
            }),
        ],
        [
            new UIStore({
                validity: Map({valid: false}),
            }),
            List([]),
            undefined,
            new UIStore({
                validity: Map({}),
            }),
        ],
        [
            new UIStore({
                validity: Map({valid: false}),
            }),
            List([]),
            true,
            new UIStore({
                validity: Map({
                    valid: true,
                    errors: null,
                }),
            }),
        ],
        [
            new UIStore({
                validity: undefined,
            }),
            List([]),
            true,
            new UIStore({
                validity: Map({
                    valid: true,
                    errors: null,
                }),
            }),
        ],
        [
            new UIStore({
                validity: Map({
                    valid: false,
                }),
            }),
            List(['prop_a']),
            true,
            new UIStore({
                validity: Map({
                    valid: false,
                    children: Map({
                        prop_a: Map({
                            valid: true,
                            errors: null,
                        }),
                    }),
                }),
            }),
        ],
        [
            new UIStore({
                validity: Map({
                    valid: false,
                }),
            }),
            List(['prop_a', 0]),
            true,
            new UIStore({
                validity: Map({
                    valid: false,
                    children: Map({
                        prop_a: Map({
                            children: List([
                                Map({
                                    valid: true,
                                    errors: null,
                                }),
                            ]),
                        }),
                    }),
                }),
            }),
        ],
        [
            new UIStore({
                validity: Map({
                    valid: false,
                    children: Map({
                        prop_a: Map({
                            valid: true,
                            children: List([
                                Map({
                                    valid: true,
                                }),
                            ]),
                        }),
                    }),
                }),
            }),
            List(['prop_a', 0]),
            undefined,
            new UIStore({
                validity: Map({
                    valid: false,
                    children: Map({
                        prop_a: Map({
                            valid: true,
                            children: List([
                                Map({}),
                            ]),
                        }),
                    }),
                }),
            }),
        ],
        [
            new UIStore({
                validity: Map({
                    valid: false,
                }),
            }),
            List(['prop_a', 0]),
            true,
            new UIStore({
                validity: Map({
                    valid: false,
                    children: Map({
                        prop_a: Map({
                            children: List([
                                Map({
                                    valid: true,
                                    errors: null,
                                }),
                            ]),
                        }),
                    }),
                }),
            }),
        ],
        [
            new UIStore({
                validity: Map({
                    valid: false,
                    children: Map({
                        prop_a: Map({
                            valid: true,
                            children: List([
                                Map({
                                    valid: true,
                                }),
                            ]),
                        }),
                    }),
                }),
            }),
            List(['prop_a', 0]),
            undefined,
            new UIStore({
                validity: Map({
                    valid: false,
                    children: Map({
                        prop_a: Map({
                            valid: true,
                            children: List([
                                Map({}),
                            ]),
                        }),
                    }),
                }),
            }),
        ],
        [
            new UIStore({
                validity: Map({
                    valid: false,
                }),
            }),
            List(['prop_a', 0, 'sub_a']),
            true,
            new UIStore({
                validity: Map({
                    valid: false,
                    children: Map({
                        prop_a: Map({
                            children: List([
                                Map({
                                    children: Map({
                                        sub_a: Map({
                                            valid: true,
                                            errors: null,
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
                validity: Map({
                    valid: false,
                    children: Map({
                        prop_a: Map({
                            valid: true,
                            children: List([
                                Map({
                                    valid: true,
                                    children: Map({
                                        sub_a: Map({
                                            valid: true,
                                        }),
                                    }),
                                }),
                            ]),
                        }),
                    }),
                }),
            }),
            List(['prop_a', 0, 'sub_a']),
            undefined,
            new UIStore({
                validity: Map({
                    valid: false,
                    children: Map({
                        prop_a: Map({
                            valid: true,
                            children: List([
                                Map({
                                    valid: true,
                                    children: Map({
                                        sub_a: Map({}),
                                    }),
                                }),
                            ]),
                        }),
                    }),
                }),
            }),
        ],
    ])('scopeUpdaterValidity(%j, %s): %j', <S extends UIStoreType>(
        store: S, storeKeys: StoreKeys,
        newValue: any,
        expected: any,
    ) => {
        const r = scopeUpdaterValidity(store, storeKeys, newValue, 'set')
        const isExpected = r.equals(expected)
        if (!isExpected) {
            console.log(
                'failed scopeUpdaterValidity',
                storeKeys.toJS(),
                // JSON.stringify(store.toJS(), undefined, 2),
                JSON.stringify(r?.toJS(), undefined, 2),
                // JSON.stringify(expected?.toJS(), undefined, 2),
            )
        }
        expect(isExpected).toBe(true)
    })
})
