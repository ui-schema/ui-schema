/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals'
import '@testing-library/jest-dom/jest-globals'
import { List, Map } from 'immutable'
import { UIStore, createStore, StoreKeys, UIStoreType } from '@ui-schema/react/UIStore'
import { doExtractValues } from '@ui-schema/react/UIStore'
import { isEqualObject } from '@ui-schema/ui-schema/Utils/isEqualObject'
import { fromJSOrdered } from '@ui-schema/ui-schema/createMap'

describe('UIStoreProvider', () => {
    test.each([
        [
            List([]),
            createStore(Map({})),
            {
                value: Map(),
                internalValue: undefined,
            },
            true,
        ],
        [
            List([]),
            createStore(List([])),
            {
                value: List(),
                internalValue: undefined,
            },
            true,
        ],
        [
            List(['prop_a']),
            // todo: should there not be `OrderedMap` around `fromJSOrdered`?
            createStore(fromJSOrdered({prop_a: 20})),
            {
                value: 20,
                internalValue: undefined,
            },
            true,
        ],
        [
            List([0]),
            // todo: should there not be `OrderedMap` around `fromJSOrdered`?
            createStore(fromJSOrdered([20])),
            {
                value: 20,
                internalValue: undefined,
            },
            true,
        ],
        [
            List(['prop_a', 'prop_0']),
            // todo: should there not be `OrderedMap` around `fromJSOrdered`?
            createStore(fromJSOrdered({prop_a: {prop_0: 20}})),
            {
                value: 20,
                internalValue: undefined,
            },
            true,
        ],
        [
            List(['prop_a', 'prop_1']),
            // todo: should there not be `OrderedMap` around `fromJSOrdered`?
            createStore(fromJSOrdered({prop_a: {prop_0: 20}})),
            {
                value: undefined,
                internalValue: undefined,
            },
            true,
        ],
        [
            List(['prop_a', 0]),
            // todo: should there not be `OrderedMap` around `fromJSOrdered`?
            createStore(fromJSOrdered({prop_a: [20]})),
            {
                value: 20,
                internalValue: undefined,
            },
            true,
        ],
        [
            List(['prop_a', 0]),
            new UIStore({
                values: fromJSOrdered({prop_a: [20]}),
                internals: Map({
                    children: Map({
                        prop_a: Map({
                            children: List([
                                Map({
                                    self: Map({internalVal: 12}),
                                    children: Map(),
                                }),
                            ]),
                        }),
                    }),
                }),
                validity: Map({}),
            }),
            {
                value: 20,
                internalValue: Map({internalVal: 12}),
            },
            true,
        ],
        [
            List(['prop_a']),
            new UIStore({
                values: fromJSOrdered({prop_a: 20}),
                internals: Map({
                    children: Map({
                        prop_a: Map({
                            self: Map({someValue: true}),
                            children: Map(),
                        }),
                    }),
                }),
                validity: Map({}),
            }),
            {
                value: 20,
                internalValue: Map({someValue: true}),
            },
            true,
        ],
    ])('doExtractValues(%j, %j): %j', (storeKeys: StoreKeys, store: UIStoreType, expected: any, expectedSameness: boolean) => {
        const r = doExtractValues(storeKeys, store)
        const isExpected = isEqualObject(r, expected)
        if (isExpected !== expectedSameness) {
            // @ts-ignore
            console.log('failed doExtractValues', storeKeys.toJS(), store.toJS(), r, expected)
        }
        expect(isExpected).toBe(expectedSameness)
    })
})
