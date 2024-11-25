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

describe('scopeUpdaterInternals', () => {
    test.each([
        [
            new UIStore({
                validity: Map({}),
            }),
            List([]),
            false,
            new UIStore({
                validity: Map({__valid: false}),
            }),
        ], [
            new UIStore({
                validity: Map({__valid: false}),
            }),
            List([]),
            undefined,
            new UIStore({
                validity: Map({}),
            }),
        ], [
            new UIStore({
                validity: Map({__valid: false}),
            }),
            List([]),
            true,
            new UIStore({
                validity: Map({__valid: true}),
            }),
        ], [
            new UIStore({
                validity: Map({__valid: false}),
            }),
            List([]),
            true,
            new UIStore({
                validity: Map({__valid: true}),
            }),
        ], [
            new UIStore({
                validity: Map({
                    __valid: false,
                }),
            }),
            List(['prop_a']),
            true,
            new UIStore({
                validity: Map({
                    __valid: false,
                    prop_a: Map({
                        __valid: true,
                    }),
                }),
            }),
        ], [
            new UIStore({
                validity: Map({
                    __valid: false,
                }),
            }),
            List(['prop_a', 0]),
            true,
            new UIStore({
                validity: Map({
                    __valid: false,
                    prop_a: Map({
                        '0': Map({
                            __valid: true,
                        }),
                    }),
                }),
            }),
        ], [
            new UIStore({
                validity: Map({
                    __valid: false,
                    prop_a: Map({
                        __valid: true,
                        '0': Map({
                            __valid: true,
                        }),
                    }),
                }),
            }),
            List(['prop_a', 0]),
            undefined,
            new UIStore({
                validity: Map({
                    __valid: false,
                    prop_a: Map({
                        __valid: true,
                        '0': Map({}),
                    }),
                }),
            }),
        ], [
            new UIStore({
                validity: Map({
                    __valid: false,
                }),
            }),
            List(['prop_a', 0]),
            true,
            new UIStore({
                validity: Map({
                    __valid: false,
                    prop_a: Map({
                        0: Map({
                            __valid: true,
                        }),
                    }),
                }),
            }),
        ], [
            new UIStore({
                validity: Map({
                    __valid: false,
                    prop_a: Map({
                        __valid: true,
                        0: Map({
                            __valid: true,
                        }),
                    }),
                }),
            }),
            List(['prop_a', 0]),
            undefined,
            new UIStore({
                validity: Map({
                    __valid: false,
                    prop_a: Map({
                        __valid: true,
                        0: Map({}),
                    }),
                }),
            }),
        ], [
            new UIStore({
                validity: Map({
                    __valid: false,
                }),
            }),
            List(['prop_a', 0, 'sub_a']),
            true,
            new UIStore({
                validity: Map({
                    __valid: false,
                    prop_a: Map({
                        '0': Map({
                            sub_a: Map({
                                __valid: true,
                            }),
                        }),
                    }),
                }),
            }),
        ], [
            new UIStore({
                validity: Map({
                    __valid: false,
                    prop_a: Map({
                        __valid: true,
                        '0': Map({
                            __valid: true,
                            sub_a: Map({
                                __valid: true,
                            }),
                        }),
                    }),
                }),
            }),
            List(['prop_a', 0, 'sub_a']),
            undefined,
            new UIStore({
                validity: Map({
                    __valid: false,
                    prop_a: Map({
                        __valid: true,
                        '0': Map({
                            __valid: true,
                            sub_a: Map({}),
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
        const r = scopeUpdaterValidity(store, storeKeys, newValue)
        const isExpected = r.equals(expected)
        if (!isExpected) {
            // @ts-ignore
            console.log(
                'failed scopeUpdaterValidity', storeKeys.toJS(),
                JSON.stringify(store.toJS(), undefined, 2),
                JSON.stringify(r?.toJS(), undefined, 2),
                JSON.stringify(expected?.toJS(), undefined, 2),
            )
        }
        expect(isExpected).toBe(true)
    })
    test.each([
        [
            new UIStore({
                validity: Map({
                    __valid: false,
                }),
            }),
            List(['__valid', 'prop_a']),
            true,
        ],
    ])('failure scopeUpdaterValidity(%j, %s): %j', <S extends UIStoreType>(
        store: S, storeKeys: StoreKeys,
        newValue: any,
    ) => {
        try {
            scopeUpdaterValidity(store, storeKeys, newValue)
            // no error, but must be error
            expect('no error').toBe('error')
        } catch (e) {
            expect(e instanceof Error).toBe(true)
            if (e instanceof Error) {
                expect(e.message).toBe('forbidden property name `__valid` is used, not compatible with UIStore')
            }
        }
    })
})
