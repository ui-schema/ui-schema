import { expect, describe, test } from '@jest/globals'
import { checkIsOtherTarget } from '@ui-schema/kit-dnd/Utils/checkIsOtherTarget'
import { DataKeys } from '@ui-schema/kit-dnd/KitDnd'
import { List } from 'immutable'

/**
 * npm run tdd -- -u --testPathPattern=src/Utils/checkIsOther
 */

describe('checkIsOtherTarget', () => {
    test.each([
        [{
            toIndex: 0,
            toDataKeys: List([]) as DataKeys,
            fromIndex: 0,
            fromDataKeys: List([]) as DataKeys,
        }, false],
        [{
            toIndex: 1,
            toDataKeys: List([]) as DataKeys,
            fromIndex: 0,
            fromDataKeys: List([]) as DataKeys,
        }, true],
        [{
            toIndex: 0,
            toDataKeys: List([]) as DataKeys,
            fromIndex: 1,
            fromDataKeys: List([]) as DataKeys,
        }, true],
        [{
            toIndex: 0,
            toDataKeys: List([]) as DataKeys,
            fromIndex: 0,
            fromDataKeys: List(['a']) as DataKeys,
        }, true],
        [{
            toIndex: 0,
            toDataKeys: List(['a']) as DataKeys,
            fromIndex: 0,
            fromDataKeys: List([]) as DataKeys,
        }, true],
        [{
            toIndex: 0,
            toDataKeys: List(['a']) as DataKeys,
            fromIndex: 0,
            fromDataKeys: List(['a']) as DataKeys,
        }, false],
        [{
            toIndex: 1,
            toDataKeys: List(['a']) as DataKeys,
            fromIndex: 0,
            fromDataKeys: List(['a']) as DataKeys,
        }, true],
        [{
            toIndex: 0,
            toDataKeys: List(['a']) as DataKeys,
            fromIndex: 1,
            fromDataKeys: List(['a']) as DataKeys,
        }, true],
        [{
            toIndex: 0,
            toDataKeys: List(['b']) as DataKeys,
            fromIndex: 0,
            fromDataKeys: List(['a']) as DataKeys,
        }, true],
        [{
            toIndex: 0,
            toDataKeys: List(['a']) as DataKeys,
            fromIndex: 0,
            fromDataKeys: List(['b']) as DataKeys,
        }, true],
    ] as [{
        toIndex: number
        toDataKeys: DataKeys
        fromIndex: number
        fromDataKeys: DataKeys
    }, boolean][])(
        'checkIsOtherTarget(%j, %s)',
        (value, expected) => {
            expect(checkIsOtherTarget(value)).toBe(expected)
        }
    )
})
