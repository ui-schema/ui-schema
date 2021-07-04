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
import { UIStore, StoreKeys, UIStoreType, createEmptyStore, StoreActions } from '@ui-schema/ui-schema/UIStore/UIStore'
import { scopeUpdaterValues } from '@ui-schema/ui-schema/UIStore/scopeUpdaterValues'

expect.extend({toBeInTheDocument, toHaveClass})

describe('scopeUpdaterValues', () => {
    test.each([
        [
            createEmptyStore('object'),
            List([]),
            OrderedMap({}),
            OrderedMap({}),
            {schema: Map({type: 'object'})},
            new UIStore({
                values: OrderedMap({}),
                internals: Map({
                    internals: Map(),
                }),
            }),
        ], [
            createEmptyStore('array'),
            List([]),
            List([]),
            List([]),
            {schema: Map({type: 'array'})},
            new UIStore({
                values: List([]),
                internals: Map({
                    internals: List(),
                }),
            }),
        ], [
            new UIStore({
                values: OrderedMap({}),
            }),
            List([]),
            OrderedMap({}),
            OrderedMap({}),
            {schema: Map({type: 'object'})},
            new UIStore({
                values: OrderedMap({}),
            }),
        ], [
            new UIStore({
                values: OrderedMap({}),
            }),
            List([]),
            OrderedMap({}),
            OrderedMap({}),
            undefined,
            new UIStore({
                values: OrderedMap({}),
            }),
        ], [
            new UIStore({
                values: OrderedMap({}),
            }),
            List([]),
            OrderedMap({}),
            undefined,
            {schema: Map({type: 'object'}), required: true},
            new UIStore({}),
        ], [
            new UIStore({
                values: OrderedMap({}),
            }),
            List(['prop_a']),
            undefined,
            'some-string',
            {schema: Map({type: 'string'})},
            new UIStore({
                values: OrderedMap({
                    prop_a: 'some-string',
                }),
            }),
        ], [
            new UIStore({
                values: OrderedMap({}),
            }),
            List(['prop_a', 0]),
            undefined,
            'some-string',
            {
                schema: Map({type: 'string'}),
            },
            new UIStore({
                values: OrderedMap({
                    prop_a: List([
                        'some-string',
                    ]),
                }),
            }),
        ], [
            new UIStore({
                values: OrderedMap({
                    prop_a: 'some-string',
                }),
            }),
            List(['prop_a']),
            'some-string',
            '',
            {schema: Map({type: 'string'}), required: true},
            new UIStore({
                values: OrderedMap({}),
            }),
        ], [
            new UIStore({
                values: OrderedMap({}),
            }),
            List(['prop_a']),
            'some-string',
            '',
            {schema: Map({type: 'string'}), required: false},
            new UIStore({
                values: OrderedMap({
                    prop_a: '',
                }),
            }),
        ], [
            new UIStore({
                values: OrderedMap({
                    prop_a: OrderedMap({
                        sub_a: 'some-string',
                    }),
                }),
            }),
            List(['prop_a', 'sub_a']),
            'some-string',
            '',
            {schema: Map({type: 'string'}), required: true},
            new UIStore({
                values: OrderedMap({
                    prop_a: OrderedMap({}),
                }),
            }),
        ], [
            new UIStore({
                values: OrderedMap({
                    prop_a: OrderedMap({
                        sub_a: 'some-string',
                    }),
                }),
            }),
            List(['prop_a', 'sub_a']),
            'some-string',
            '',
            {schema: Map({type: 'string'}), required: false},
            new UIStore({
                values: OrderedMap({
                    prop_a: OrderedMap({
                        sub_a: '',
                    }),
                }),
            }),
        ], [
            new UIStore({
                values: OrderedMap({
                    prop_a: List([
                        'some-string-0',
                        'some-string-1',
                        'some-string-2',
                        'some-string-3',
                    ]),
                }),
            }),
            List(['prop_a', 0]),
            'some-string-0',
            '',
            {schema: Map({type: 'string'}), required: true},
            new UIStore({
                values: OrderedMap({
                    prop_a: List([
                        // todo: change test with correct tuple behaviour
                        null,
                        'some-string-1',
                        'some-string-2',
                        'some-string-3',
                    ]),
                }),
            }),
        ], [
            new UIStore({
                values: OrderedMap({
                    prop_a: List([
                        'some-string-0',
                        'some-string-1',
                        'some-string-2',
                        'some-string-3',
                    ]),
                }),
            }),
            List(['prop_a', 1]),
            'some-string-0',
            '',
            {schema: Map({type: 'string'}), required: true},
            new UIStore({
                values: OrderedMap({
                    prop_a: List([
                        // todo: change test with correct tuple behaviour
                        'some-string-0',
                        null,
                        'some-string-2',
                        'some-string-3',
                    ]),
                }),
            }),
        ], [
            new UIStore({
                values: OrderedMap({
                    prop_a: List([
                        'some-string-0',
                        'some-string-1',
                        'some-string-2',
                        'some-string-3',
                    ]),
                }),
            }),
            List(['prop_a', 3]),
            'some-string-0',
            '',
            {schema: Map({type: 'string'}), required: true},
            new UIStore({
                values: OrderedMap({
                    prop_a: List([
                        // todo: change test with correct tuple behaviour
                        'some-string-0',
                        'some-string-1',
                        'some-string-2',
                        null,
                    ]),
                }),
            }),
        ], [
            new UIStore({
                values: 'some-string',
            }),
            List([]),
            'some-string',
            '',
            {schema: Map({type: 'string'}), required: true},
            new UIStore({}).delete('values'),
        ], [
            new UIStore({
                values: OrderedMap({
                    prop_a: 'already-changed',
                }),
            }),
            List(['prop_a', 'sub_a']),
            'some-string-b',
            '',
            {schema: Map({type: 'string'}), required: true},
            new UIStore({
                values: OrderedMap({
                    prop_a: 'already-changed',
                }),
            }),
        ], [
            new UIStore({
                values: OrderedMap({
                    prop_a: 'already-changed',
                }),
            }),
            List(['prop_a', 'sub_a']),
            undefined,
            '',
            {schema: Map({type: 'string'}), required: true},
            new UIStore({
                values: OrderedMap({
                    prop_a: OrderedMap({}),
                }),
            }),
        ], [
            new UIStore({
                values: OrderedMap({
                    prop_a: 'already-changed',
                }),
            }),
            List(['prop_a', 'sub_a']),
            undefined,
            '',
            {schema: Map({type: 'string'}), required: false},
            new UIStore({
                values: OrderedMap({
                    prop_a: OrderedMap({
                        sub_a: '',
                    }),
                }),
            }),
        ],
    ])('scopeUpdaterValues(%j, %s, %j, %j, %j): %j', <S extends UIStoreType>(
        store: S, storeKeys: StoreKeys,
        oldValue: any, newValue: any,
        action: StoreActions,
        expected: any
    ) => {
        const r = scopeUpdaterValues(store, storeKeys, oldValue, newValue, action)
        const isExpected = r.equals(expected)
        if (!isExpected) {
            console.log(
                'failed scopeUpdaterValues', storeKeys.toJS(),
                JSON.stringify(store.toJS(), undefined, 2),
                JSON.stringify(r?.toJS(), undefined, 2),
                JSON.stringify(expected?.toJS(), undefined, 2)
            )
        }
        expect(isExpected).toBe(true)
    })
})
