/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals'
import '@testing-library/jest-dom/jest-globals'
import { List, Map } from 'immutable'
import { UIStore, createStore, StoreKeys, UIStoreType } from '@ui-schema/ui-schema/UIStore'
import { doExtractValues } from '@ui-schema/ui-schema/UIStore'
import { isEqualObject } from '@ui-schema/ui-schema/Utils/isEqualObject'
import { fromJSOrdered } from '@ui-schema/ui-schema/Utils/createMap'

describe('UIStoreProvider', () => {
    test.each([
        [
            List([]),
            createStore(Map({})),
            {
                value: Map(),
                internalValue: Map({
                    internals: Map(),
                }),
            },
            true,
        ], [
            List([]),
            createStore(List([])),
            {
                value: List(),
                internalValue: Map({
                    internals: List(),
                }),
            },
            true,
        ], [
            List(['prop_a']),
            createStore(fromJSOrdered({prop_a: 20})),
            {
                value: 20,
                internalValue: Map(),
            },
            true,
        ], [
            List([0]),
            createStore(fromJSOrdered([20])),
            {
                value: 20,
                internalValue: Map(),
            },
            true,
        ], [
            List(['prop_a', 'prop_0']),
            createStore(fromJSOrdered({prop_a: {prop_0: 20}})),
            {
                value: 20,
                internalValue: Map(),
            },
            true,
        ], [
            List(['prop_a', 'prop_1']),
            createStore(fromJSOrdered({prop_a: {prop_0: 20}})),
            {
                value: undefined,
                internalValue: Map(),
            },
            true,
        ], [
            List(['prop_a', 0]),
            createStore(fromJSOrdered({prop_a: [20]})),
            {
                value: 20,
                internalValue: Map(),
            },
            true,
        ], [
            List(['prop_a', 0]),
            new UIStore({
                values: fromJSOrdered({prop_a: [20]}),
                internals: Map({
                    internals: Map({
                        prop_a: Map({
                            internals: List([
                                Map({
                                    internals: Map(),
                                }),
                            ]),
                        }),
                    }),
                }),
                validity: Map({}),
            }),
            {
                value: 20,
                internalValue: Map({
                    internals: Map(),
                }),
            },
            true,
        ], [
            List(['prop_a']),
            new UIStore({
                values: fromJSOrdered({prop_a: 20}),
                internals: Map({
                    internals: Map({
                        prop_a: Map({
                            someValue: true,
                            internals: Map(),
                        }),
                    }),
                }),
                validity: Map({}),
            }),
            {
                value: 20,
                internalValue: Map({
                    someValue: true,
                    internals: Map(),
                }),
            },
            true,
        ],
    ])('doExtractValues(%j, %j): %j', (storeKeys: StoreKeys, store: UIStoreType, expected: any, expectedSameness: boolean) => {
        const r = doExtractValues(storeKeys, store)
        const isExpected = isEqualObject(r, expected)
        if(isExpected !== expectedSameness) {
            // @ts-ignore
            console.log('failed doExtractValues', storeKeys.toJS(), store.toJS(), r, expected)
        }
        expect(isExpected).toBe(expectedSameness)
    })
})
