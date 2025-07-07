/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals'
import '@testing-library/jest-dom/jest-globals'
import { StoreKeyType } from '@ui-schema/ui-schema/ValueStore'
import { List, OrderedMap } from 'immutable'
import { UIStore, StoreKeys, UIStoreType, createEmptyStore } from '@ui-schema/react/UIStore'
import { scopeUpdaterValues } from './scopeUpdaterValues.js'

/**
 * npm run tdd -- --testPathPattern=src/storeScopeUpdater/scopeUpdaterValues.test.tsx
 */

describe('scopeUpdaterValues', () => {
    test.each([
        [
            createEmptyStore('object'),
            List<StoreKeyType>([]),
            OrderedMap({}),
            'set' as const,
            new UIStore({
                values: OrderedMap({}),
                internals: undefined,
                validity: undefined,
            }),
        ],
        [
            createEmptyStore('array'),
            List<StoreKeyType>([]),
            List([]),
            'set' as const,
            new UIStore({
                values: List([]),
                internals: undefined,
                validity: undefined,
            }),
        ],
        [
            new UIStore({
                values: OrderedMap({}),
            }),
            List<StoreKeyType>([]),
            OrderedMap({}),
            'set' as const,
            new UIStore({
                values: OrderedMap({}),
            }),
        ],
        [
            new UIStore({
                values: OrderedMap({}),
            }),
            List<StoreKeyType>([]),
            OrderedMap({}),
            'set' as const,
            new UIStore({
                values: OrderedMap({}),
            }),
        ],
        [
            new UIStore({
                values: OrderedMap({}),
            }),
            List<StoreKeyType>([]),
            undefined,
            'delete',
            new UIStore({}),
        ],
        [
            new UIStore({
                values: OrderedMap({}),
            }),
            List(['prop_a']),
            'some-string',
            'set' as const,
            new UIStore({
                values: OrderedMap({
                    prop_a: 'some-string',
                }),
            }),
        ],
        [
            new UIStore({
                values: OrderedMap({}),
            }),
            List(['prop_a', 0]),
            'some-string',
            'set' as const,
            new UIStore({
                values: OrderedMap({
                    prop_a: List([
                        'some-string',
                    ]),
                }),
            }),
        ],
        // [
        //     new UIStore({
        //         values: OrderedMap({
        //             prop_a: 'some-string',
        //         }),
        //     }),
        //     List(['prop_a']),
        //     '',
        //     'set' as const,
        //     new UIStore({
        //         values: OrderedMap({}),
        //     }),
        // ],
        [
            new UIStore({
                values: OrderedMap({}),
            }),
            List(['prop_a']),
            '',
            'set' as const,
            new UIStore({
                values: OrderedMap({
                    prop_a: '',
                }),
            }),
        ],
        // [
        //     new UIStore({
        //         values: OrderedMap({
        //             prop_a: OrderedMap({
        //                 sub_a: 'some-string',
        //             }),
        //         }),
        //     }),
        //     List(['prop_a', 'sub_a']),
        //     '',
        //     'set' as const,
        //     new UIStore({
        //         values: OrderedMap({
        //             prop_a: OrderedMap({}),
        //         }),
        //     }),
        // ],
        [
            new UIStore({
                values: OrderedMap({
                    prop_a: OrderedMap({
                        sub_a: 'some-string',
                    }),
                }),
            }),
            List(['prop_a', 'sub_a']),
            '',
            'set' as const,
            new UIStore({
                values: OrderedMap({
                    prop_a: OrderedMap({
                        sub_a: '',
                    }),
                }),
            }),
        ],
        // [
        //     new UIStore({
        //         values: OrderedMap({
        //             prop_a: List([
        //                 'some-string-0',
        //                 'some-string-1',
        //                 'some-string-2',
        //                 'some-string-3',
        //             ]),
        //         }),
        //     }),
        //     List(['prop_a', 0]),
        //     '',
        //     'set' as const,
        //     new UIStore({
        //         values: OrderedMap({
        //             prop_a: List([
        //                 // todo: change test with correct tuple behaviour
        //                 null,
        //                 'some-string-1',
        //                 'some-string-2',
        //                 'some-string-3',
        //             ]),
        //         }),
        //     }),
        // ],
        // [
        //     new UIStore({
        //         values: OrderedMap({
        //             prop_a: List([
        //                 'some-string-0',
        //                 'some-string-1',
        //                 'some-string-2',
        //                 'some-string-3',
        //             ]),
        //         }),
        //     }),
        //     List(['prop_a', 1]),
        //     '',
        //     'set' as const,
        //     new UIStore({
        //         values: OrderedMap({
        //             prop_a: List([
        //                 // todo: change test with correct tuple behaviour
        //                 'some-string-0',
        //                 null,
        //                 'some-string-2',
        //                 'some-string-3',
        //             ]),
        //         }),
        //     }),
        // ],
        // [
        //     new UIStore({
        //         values: OrderedMap({
        //             prop_a: List([
        //                 'some-string-0',
        //                 'some-string-1',
        //                 'some-string-2',
        //                 'some-string-3',
        //             ]),
        //         }),
        //     }),
        //     List(['prop_a', 3]),
        //     '',
        //     'set' as const,
        //     new UIStore({
        //         values: OrderedMap({
        //             prop_a: List([
        //                 // todo: change test with correct tuple behaviour
        //                 'some-string-0',
        //                 'some-string-1',
        //                 'some-string-2',
        //                 null,
        //             ]),
        //         }),
        //     }),
        // ],
        // [
        //     new UIStore({
        //         values: 'some-string',
        //     }),
        //     List<StoreKeyType>([]),
        //     '',
        //     'set' as const,
        //     new UIStore({}).delete('values'),
        // ],
        // [
        //     new UIStore({
        //         values: OrderedMap({
        //             prop_a: 'already-changed',
        //         }),
        //     }),
        //     List(['prop_a', 'sub_a']),
        //     '',
        //     'set' as const,
        //     new UIStore({
        //         values: OrderedMap({
        //             prop_a: OrderedMap({}),
        //         }),
        //     }),
        // ],
        [
            new UIStore({
                values: OrderedMap({
                    prop_a: 'already-changed',
                }),
            }),
            List(['prop_a', 'sub_a']),
            '',
            'set' as const,
            new UIStore({
                values: OrderedMap({
                    prop_a: OrderedMap({
                        sub_a: '',
                    }),
                }),
            }),
        ],
    ])('scopeUpdaterValues(%j, %s, %j, %j): %j', (
        store: UIStoreType,
        storeKeys: StoreKeys,
        newValue: any,
        op: string | 'set' | 'delete' | undefined,
        expected: any,
    ) => {
        const r = scopeUpdaterValues(
            store, storeKeys, newValue,
            // @ts-expect-error
            op,
        )
        const isExpected = r.equals(expected)
        if (!isExpected) {
            console.log(
                'failed scopeUpdaterValues',
                storeKeys.toJS(),
                // JSON.stringify(store.toJS(), undefined, 2),
                JSON.stringify(r?.toJS(), undefined, 2),
                // JSON.stringify(expected?.toJS(), undefined, 2),
            )
        }
        expect(isExpected).toBe(true)
    })
})
