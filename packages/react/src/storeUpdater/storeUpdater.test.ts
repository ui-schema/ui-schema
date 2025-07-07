/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals'
import '@testing-library/jest-dom/jest-globals'
import { List, Map, OrderedMap } from 'immutable'
import { UIStore, StoreKeys, UIStoreType, UIStoreUpdaterFn } from '@ui-schema/react/UIStore'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { UIStoreActions, UIStoreActionUpdate, UIStoreUpdaterData } from '@ui-schema/react/UIStoreActions'

/**
 * npm run tdd -- --testPathPattern=src/storeUpdater/storeUpdater.test.ts --selectProjects=test-@ui-schema/react
 */

describe('storeUpdater', () => {
    // todo: in a future version, combine all testCases, keep separated for 0.5.x to guarantee old behaviour is tested identical
    const testCasesUpdate: [
        UIStoreType,
        StoreKeys,
        (keyof UIStoreUpdaterData)[],
        UIStoreUpdaterFn,
            boolean | undefined,
            string | undefined,
        UIStoreType
    ][] = [
        [
            new UIStore({
                values: OrderedMap({}),
            }),
            List([]),
            ['value'],
            ({value}) => ({value}),
            undefined,
            undefined,
            new UIStore({
                values: OrderedMap({}),
            }),
        ],
        [
            new UIStore({
                values: OrderedMap({
                    prop_a: 'some-string',
                }),
            }),
            List(['prop_a']),
            ['value'],
            ({value}) => ({value: value + '--modified'}),
            undefined,
            undefined,
            new UIStore({
                values: OrderedMap({
                    prop_a: 'some-string--modified',
                }),
            }),
        ],
        [
            new UIStore({// initial store
                values: OrderedMap({
                    prop_a: 'some-string',
                }),
            }),
            List(['prop_a']),// storeKeys
            ['value'],// scopes
            () => ({value: ''}),
            true,// deleteOnEmpty
            'string',// type
            new UIStore({// expected
                values: OrderedMap({}),
            }),
        ],
        [
            new UIStore({// initial store
                values: OrderedMap({
                    prop_a: 'some-string',
                }),
                internals: Map({}),
                validity: Map({}),
            }),
            List(['prop_a']),// storeKeys
            ['value', 'internal', 'valid'],// scopes
            ({value, internal = Map({})}) => ({
                value: value + '--modified',
                internal: internal.set('value', 'some-state'),
                valid: true,
            }),
            undefined,// deleteOnEmpty
            undefined,// type
            new UIStore({// expected
                values: OrderedMap({
                    prop_a: 'some-string--modified',
                }),
                internals: Map({
                    children: Map({
                        prop_a: Map({
                            self: Map({value: 'some-state'}),
                        }),
                    }),
                }),
                validity: Map({
                    children: Map({
                        prop_a: Map({
                            valid: true,
                            errors: null,
                        }),
                    }),
                }),
            }),
        ],
    ]

    test.each(testCasesUpdate)('`update` action %j, %j', (
        store: UIStoreType,
        storeKeys: StoreKeys,
        scopes: (keyof UIStoreUpdaterData)[],
        updater: UIStoreUpdaterFn,
        deleteOnEmpty: boolean | undefined,
        type: string | undefined,
        expected: UIStoreType,
    ) => {
        const action: UIStoreActionUpdate = {
            type: 'update',
            storeKeys,
            scopes,
            updater: updater,
            ...(type ? {schema: Map({type})} : {}),
            ...(deleteOnEmpty ? {required: true} : {}),
        }
        const r = storeUpdater(action)(store)
        const isExpected = r.equals(expected)
        if (!isExpected) {
            console.log(
                'failed storeUpdater',
                storeKeys.toJS(), scopes,
                // JSON.stringify(store.toJS(), undefined, 2),
                JSON.stringify(r?.toJS(), undefined, 2),
                // JSON.stringify(expected?.toJS(), undefined, 2),
            )
        }
        expect(isExpected).toBe(true)
    })

    const testCases: ({
        name: string
        action: UIStoreActions | UIStoreActions[]
        store: UIStoreType
    } & ({ expected: UIStoreType } | { expectedError: string }))[] = [
        {
            name: 'set value in root',
            action: {
                type: 'set',
                storeKeys: List(),
                scopes: ['value'],
                data: {
                    value: 123,
                },
            },
            store: new UIStore({
                values: undefined,
            }),
            expected: new UIStore({
                values: 123,
            }),
        },
        {
            name: 'set value in nested property with empty root',
            action: {
                type: 'set',
                storeKeys: List(['prop_a']),
                scopes: ['value'],
                data: {
                    value: 123,
                },
            },
            store: new UIStore({
                values: undefined,
            }),
            expected: new UIStore({
                values: OrderedMap({prop_a: 123}),
            }),
        },
        {
            name: 'set value in nested property with compatible non-empty root',
            action: {
                type: 'set',
                storeKeys: List(['prop_a']),
                scopes: ['value'],
                data: {
                    value: 123,
                },
            },
            store: new UIStore({
                values: OrderedMap(),
            }),
            expected: new UIStore({
                values: OrderedMap({prop_a: 123}),
            }),
        },
        {
            name: 'set value in nested property with undefined for delete',
            action: {
                type: 'set',
                storeKeys: List(['prop_a']),
                scopes: ['value'],
                data: {
                    value: undefined,
                },
                // to delete a field, the `set` action
                // needs either `required` or `schema.deleteOnEmpty`
                required: true,
            },
            store: new UIStore({
                values: OrderedMap({prop_a: 123}),
            }),
            expected: new UIStore({
                values: OrderedMap({}),
            }),
        },
        // todo: conflicting values are undefined behaviour
        // {
        //     name: 'set value in nested property with conflicting non-empty root',
        //     action: {
        //         type: 'set',
        //         storeKeys: List(['prop_a']),
        //         scopes: ['value'],
        //         data: {
        //             value: 123,
        //         },
        //     },
        //     store: new UIStore({
        //         values: 'Lorem',
        //     }),
        //     expected: new UIStore({
        //         values: OrderedMap({prop_a: 123}),
        //     }),
        // },
        {
            name: 'delete value in nested property',
            action: {
                type: 'delete',
                storeKeys: List(['prop_a']),
                scopes: ['value'],
            },
            store: new UIStore({
                values: OrderedMap({prop_a: 123}),
            }),
            expected: new UIStore({
                values: OrderedMap(),
            }),
        },
        {
            name: 'delete value root',
            action: {
                type: 'delete',
                storeKeys: List([]),
                scopes: ['value'],
            },
            store: new UIStore({
                values: OrderedMap(),
            }),
            expectedError: 'Can not delete root value.',
        },
        {
            name: 'delete value in non object',
            action: {
                type: 'delete',
                storeKeys: List(['prop_a']),
                scopes: ['value'],
            },
            store: new UIStore({
                values: List(),
            }),
            expectedError: 'Can only delete in object values.',
        },
        {
            name: 'delete value in deeper obj',
            action: {
                type: 'delete',
                storeKeys: List(['obj', 'prop_a']),
                scopes: ['value'],
            },
            store: new UIStore({
                values: OrderedMap({obj: OrderedMap({prop_a: 123})}),
            }),
            expected: new UIStore({
                values: OrderedMap({obj: OrderedMap()}),
            }),
        },
        {
            name: 'delete value in non existing',
            action: {
                type: 'delete',
                storeKeys: List(['obj', 'prop_a']),
                scopes: ['value'],
            },
            store: new UIStore({
                values: OrderedMap(),
            }),
            expected: new UIStore({
                values: OrderedMap(),
            }),
        },
        //
        // test cases for `list-item-*` actions
        //
        {
            name: 'list-item-add: add to empty list',
            action: {
                type: 'list-item-add',
                storeKeys: List(['myList']),
                itemValue: 'newItem',
            },
            store: new UIStore({
                values: OrderedMap({myList: List()}),
            }),
            expected: new UIStore({
                values: OrderedMap({myList: List(['newItem'])}),
                internals: Map({
                    self: Map({}),
                    children: Map({
                        myList: Map({
                            children: List([
                                Map({
                                    self: Map({defaultHandled: true}),
                                }),
                            ]),
                        }),
                    }),
                }),
            }),
        },
        {
            name: 'list-item-add: add to existing list',
            action: {
                type: 'list-item-add',
                storeKeys: List(['myList']),
                itemValue: 'item2',
            },
            store: new UIStore({
                values: OrderedMap({myList: List(['item1'])}),
            }),
            expected: new UIStore({
                values: OrderedMap({myList: List(['item1', 'item2'])}),
                internals: Map({
                    self: Map({}),
                    children: Map({
                        myList: Map({
                            children: List([
                                undefined,
                                Map({
                                    self: Map({defaultHandled: true}),
                                }),
                            ]),
                        }),
                    }),
                }),
            }),
        },
        {
            name: 'list-item-add: add to empty list, with schema',
            action: {
                type: 'list-item-add',
                storeKeys: List(['myList']),
                schema: OrderedMap({items: OrderedMap({type: 'boolean'})}),
            },
            store: new UIStore({
                values: OrderedMap({myList: List()}),
            }),
            expected: new UIStore({
                values: OrderedMap({myList: List([false])}),
                internals: Map({
                    self: Map(),
                    children: Map({
                        myList: Map({
                            children: List([
                                Map({
                                    self: Map({defaultHandled: true}),
                                }),
                            ]),
                        }),
                    }),
                }),
            }),
        },
        {
            name: 'list-item-add: add to existing list, with schema',
            action: {
                type: 'list-item-add',
                storeKeys: List(['myList']),
                schema: OrderedMap({items: OrderedMap({type: 'boolean'})}),
            },
            store: new UIStore({
                values: OrderedMap({myList: List(['item1'])}),
            }),
            expected: new UIStore({
                values: OrderedMap({myList: List(['item1', false])}),
                internals: Map({
                    self: Map(),
                    children: Map({
                        myList: Map({
                            children: List([
                                undefined,
                                Map({
                                    self: Map({defaultHandled: true}),
                                }),
                            ]),
                        }),
                    }),
                }),
            }),
        },
        {
            name: 'list-item-move: move item down',
            action: {
                type: 'list-item-move',
                storeKeys: List(['myList']),
                fromIndex: 0,
                toIndex: 1,
            },
            store: new UIStore({
                values: OrderedMap({myList: List(['a', 'b', 'c'])}),
            }),
            expected: new UIStore({
                values: OrderedMap({myList: List(['b', 'a', 'c'])}),
                internals: Map({
                    self: Map(),
                    children: Map({
                        myList: Map({
                            children: List([undefined, undefined]),
                        }),
                    }),
                }),
            }),
        },
        {
            name: 'list-item-move: move item up',
            action: {
                type: 'list-item-move',
                storeKeys: List(['myList']),
                fromIndex: 2,
                toIndex: 0,
            },
            store: new UIStore({
                values: OrderedMap({myList: List(['a', 'b', 'c'])}),
            }),
            expected: new UIStore({
                values: OrderedMap({myList: List(['c', 'a', 'b'])}),
                internals: Map({
                    self: Map(),
                    children: Map({
                        myList: Map({
                            children: List([undefined]),
                        }),
                    }),
                }),
            }),
        },
        //
        // test cases for `update` action
        //
        {
            name: 'update: only internal scope',
            action: {
                type: 'update',
                storeKeys: List(['prop_a']),
                scopes: ['internal'],
                updater: ({internal = Map()}) => ({internal: internal.set('some', 'state')}),
            },
            store: new UIStore({
                values: OrderedMap({prop_a: 'val_a'}),
            }),
            expected: new UIStore({
                values: OrderedMap({prop_a: 'val_a'}),
                internals: Map({
                    self: Map({}),
                    children: Map({
                        prop_a: Map({
                            self: Map({some: 'state'}),
                        }),
                    }),
                }),
            }),
        },
        {
            name: 'update: only valid scope',
            action: {
                type: 'update',
                storeKeys: List(['prop_a']),
                scopes: ['valid'],
                updater: () => ({valid: false}),
            },
            store: new UIStore({
                values: OrderedMap({prop_a: 'val_a'}),
            }),
            expected: new UIStore({
                values: OrderedMap({prop_a: 'val_a'}),
                validity: Map({
                    children: Map({
                        prop_a: Map({
                            valid: false,
                            errors: null,
                        }),
                    }),
                }),
            }),
        },
        {
            name: 'update: only meta scope',
            action: {
                type: 'update',
                storeKeys: List(),
                scopes: ['meta'],
                updater: ({meta = Map()}) => ({meta: meta.set('b', 2)}),
            },
            store: new UIStore({
                values: OrderedMap({prop_a: 'val_a'}),
                meta: Map({a: 1}),
            }),
            expected: new UIStore({
                values: OrderedMap({prop_a: 'val_a'}),
                meta: Map({a: 1, b: 2}),
            }),
        },
        {
            name: 'update: delete value but keep other scopes',
            action: {
                type: 'update',
                storeKeys: List(['prop_a']),
                scopes: ['value', 'internal'],
                updater: ({internal = Map()}) => ({
                    value: '',
                    internal: internal.set('updated', true),
                }),
                required: true,
                schema: Map({type: 'string'}),
            },
            store: new UIStore({
                values: OrderedMap({prop_a: 'some-string'}),
                internals: Map({
                    children: Map({
                        prop_a: Map({
                            self: Map({initial: true}),
                        }),
                    }),
                }),
            }),
            expected: new UIStore({
                values: OrderedMap({}),
                internals: Map({
                    children: Map({
                        prop_a: Map({
                            self: Map({initial: true, updated: true}),
                        }),
                    }),
                }),
            }),
        },
        //
        // test cases for multiple actions (single vs. multiple scopes)
        //
        {
            name: 'multiple actions: set value then update internal for same key',
            action: [
                {
                    type: 'set',
                    storeKeys: List(['prop_a']),
                    scopes: ['value'],
                    data: {value: 'new-value'},
                },
                {
                    type: 'update',
                    storeKeys: List(['prop_a']),
                    scopes: ['internal'],
                    updater: () => ({internal: Map({state: 1})}),
                },
            ],
            store: new UIStore({
                values: OrderedMap({prop_a: 'old-value'}),
            }),
            expected: new UIStore({
                values: OrderedMap({prop_a: 'new-value'}),
                internals: Map({
                    self: Map({}),
                    children: Map({
                        prop_a: Map({
                            self: Map({state: 1}),
                        }),
                    }),
                }),
            }),
        },
        {
            name: 'multiple actions: update value then set internal for same key',
            action: [
                {
                    type: 'update',
                    storeKeys: List(['prop_a']),
                    scopes: ['value'],
                    updater: ({value}) => ({value: value + '-updated'}),
                },
                {
                    type: 'set',
                    storeKeys: List(['prop_a']),
                    scopes: ['internal'],
                    data: {internal: Map({state: 2})},
                },
            ],
            store: new UIStore({
                values: OrderedMap({prop_a: 'old-value'}),
            }),
            expected: new UIStore({
                values: OrderedMap({prop_a: 'old-value-updated'}),
                internals: Map({
                    self: Map({}),
                    children: Map({
                        prop_a: Map({
                            self: Map({state: 2}),
                        }),
                    }),
                }),
            }),
        },
        {
            name: 'multiple actions: set to delete value, then set internal',
            action: [
                {
                    type: 'set',
                    storeKeys: List(['prop_a']),
                    scopes: ['value'],
                    data: {value: ''},
                    required: true,
                    schema: Map({type: 'string'}),
                },
                {
                    type: 'set',
                    storeKeys: List(['prop_a']),
                    scopes: ['internal'],
                    data: {internal: Map({state: 3})},
                },
            ],
            store: new UIStore({
                values: OrderedMap({prop_a: 'old-value'}),
            }),
            expected: new UIStore({
                values: OrderedMap({}),
                internals: Map({
                    self: Map({}),
                    children: Map({
                        prop_a: Map({
                            self: Map({state: 3}),
                        }),
                    }),
                }),
            }),
        },
        {
            name: 'multiple actions: update to delete value, then set internal',
            action: [
                {
                    type: 'update',
                    storeKeys: List(['prop_a']),
                    scopes: ['value'],
                    updater: () => ({value: ''}),
                    required: true,
                    schema: Map({type: 'string'}),
                },
                {
                    type: 'set',
                    storeKeys: List(['prop_a']),
                    scopes: ['internal'],
                    data: {internal: Map({state: 4})},
                },
            ],
            store: new UIStore({
                values: OrderedMap({prop_a: 'old-value'}),
            }),
            expected: new UIStore({
                values: OrderedMap({}),
                internals: Map({
                    self: Map({}),
                    children: Map({
                        prop_a: Map({
                            self: Map({state: 4}),
                        }),
                    }),
                }),
            }),
        },
        {
            name: 'multiple actions: set different properties sequentially',
            action: [
                {
                    type: 'set',
                    storeKeys: List(['prop_a']),
                    scopes: ['value'],
                    data: {value: 'val_a'},
                },
                {
                    type: 'set',
                    storeKeys: List(['prop_b']),
                    scopes: ['value'],
                    data: {value: 'val_b'},
                },
            ],
            store: new UIStore({
                values: OrderedMap(),
            }),
            expected: new UIStore({
                values: OrderedMap({prop_a: 'val_a', prop_b: 'val_b'}),
            }),
        },
    ]

    test.each(testCases)('storeUpdater: $name', (testCase) => {
        if ('expected' in testCase) {
            const r = storeUpdater(testCase.action)(testCase.store)
            const isExpected = r.equals(testCase.expected)
            if (!isExpected) {
                console.log(
                    'failed storeUpdater',
                    {...testCase, expected: undefined, store: undefined},
                    'test-store:',
                    JSON.stringify(testCase?.store?.toJS(), undefined, 2),
                    'expected-store:',
                    JSON.stringify(testCase?.expected?.toJS(), undefined, 2),
                    'actual-store:',
                    JSON.stringify(r?.toJS(), undefined, 2),
                )
            }
            expect(isExpected).toBe(true)
        } else {
            expect(() => storeUpdater(testCase.action)(testCase.store)).toThrow(testCase.expectedError)
        }
    })
})
