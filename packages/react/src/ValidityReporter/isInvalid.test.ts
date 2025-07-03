/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals'
import { StoreKeys } from '@ui-schema/ui-schema/ValueStore'
import { List, Map } from 'immutable'
import { addNestKey } from '@ui-schema/react/UIStore'
import { isInvalid } from './isInvalid.js'

/**
 * npm run tdd -- --testPathPattern=isInvalid.test.ts --selectProjects=test-@ui-schema/react
 */

describe('isInvalid', () => {
    test.each([
        {
            validity: undefined,
            storeKeys: undefined,
            count: undefined,
            expected: 0,
        },
        {
            validity: Map({
                valid: false,
                children: Map({
                    a: Map({
                        valid: false,
                    }),
                    b: Map({
                        valid: true,
                        children: List([
                            Map({
                                valid: false,
                            }),
                        ]),
                    }),
                }),
            }),
            storeKeys: undefined,
            count: undefined,
            expected: 1,
        },
        {
            validity: Map({
                valid: false,
                children: Map({
                    a: Map({
                        valid: false,
                    }),
                    b: Map({
                        valid: true,
                        children: List([
                            Map({
                                valid: false,
                            }),
                        ]),
                    }),
                }),
            }),
            storeKeys: List([]),
            count: false,
            expected: 1,
        },
        {
            validity: Map({
                valid: false,
                children: Map({
                    a: Map({
                        valid: false,
                    }),
                    b: Map({
                        valid: true,
                        children: List([
                            Map({
                                valid: false,
                            }),
                        ]),
                    }),
                }),
            }),
            storeKeys: List([]),
            count: true,
            expected: 3,
        },
        {
            validity: Map({
                valid: false,
                children: Map({
                    a: Map({
                        valid: false,
                    }),
                    b: Map({
                        valid: true,
                        children: List([
                            Map({
                                valid: false,
                            }),
                        ]),
                    }),
                }),
            }),
            // todo: don't rely on addNestKey here? move it into `isInvalid`?
            storeKeys: addNestKey('children', List(['b', 0])),
            count: true,
            expected: 1,
        },
        {
            // incomplete/invalid store; robust
            validity: Map({
                valid: false,
                children: Map({
                    a: Map({
                        valid: false,
                        children: undefined,
                    }),
                    b: Map({
                        valid: true,
                        children: List([
                            undefined,
                            Map({
                                valid: false,
                            }),
                            undefined,
                        ]),
                    }),
                }),
            }),
            storeKeys: undefined,
            count: true,
            expected: 3,
        },
    ])('$# isInvalid', (
        args: {
            validity: Map<any, any> | undefined
            storeKeys: StoreKeys | undefined
            count: boolean | undefined
            expected: number
        },
    ) => {
        const r = isInvalid(args.validity, args.storeKeys, args.count)
        expect(r).toBe(args.expected)
    })
})
