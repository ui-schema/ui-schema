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
import { scopeUpdaterValidity } from '@ui-schema/ui-schema/UIStore/scopeUpdaterValidity'

expect.extend({toBeInTheDocument, toHaveClass})

describe('scopeUpdaterInternals', () => {
    test.each([
        [
            new UIStore({}),
            List([]),
            undefined,
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
            undefined,
            new UIStore({
                validity: Map({}),
            }),
        ], [
            new UIStore({
                validity: Map({__valid: false}),
            }),
            List([]),
            undefined,
            true,
            new UIStore({
                validity: Map({__valid: true}),
            }),
        ], [
            new UIStore({
                validity: Map({__valid: false}),
            }),
            List([]),
            false,
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
            undefined,
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
            undefined,
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
            true,
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
            undefined,
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
            true,
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
            undefined,
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
            true,
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
    ])('scopeUpdaterValidity(%j, %s, %j): %j', <S extends UIStoreType>(
        store: S, storeKeys: StoreKeys,
        oldValue: any, newValue: any,
        expected: any
    ) => {
        const r = scopeUpdaterValidity(store, storeKeys, oldValue, newValue)
        const isExpected = r.equals(expected)
        if (!isExpected) {
            // @ts-ignore
            console.log(
                'failed scopeUpdaterValidity', storeKeys.toJS(),
                JSON.stringify(store.toJS(), undefined, 2),
                JSON.stringify(r?.toJS(), undefined, 2),
                JSON.stringify(expected?.toJS(), undefined, 2)
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
            undefined,
            true,
        ],
    ])('failure scopeUpdaterValidity(%j, %s, %j): %j', <S extends UIStoreType>(
        store: S, storeKeys: StoreKeys,
        oldValue: any, newValue: any
    ) => {
        try {
            scopeUpdaterValidity(store, storeKeys, oldValue, newValue)
            // no error, but must be error
            expect('no error').toBe('error')
        } catch (e) {
            expect(e instanceof Error).toBe(true)
            expect(e.message).toBe('forbidden property name `__valid` is used, not compatible with UIStore')
        }
    })
})
