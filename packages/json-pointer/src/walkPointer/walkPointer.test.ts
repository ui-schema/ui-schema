import { expect, describe, test } from '@jest/globals'
import { walkPointer } from './walkPointer.js'

function pick(current: unknown, key: string | number) {
    if (Array.isArray(current)) {
        const index = Number(key)
        if (Number.isNaN(index)) {
            return undefined
        }
        return current[index]
    } else if (typeof current === 'object' && current) {
        return current[key]
    }
    return undefined
}

function pickChildren(current: unknown, key: string | number) {
    if (!current || typeof current !== 'object') return undefined
    const d = current as { children?: object | unknown[] }
    if (Array.isArray(d.children)) {
        const index = Number(key)
        if (Number.isNaN(index)) {
            return undefined
        }
        return d.children[index]
    } else if (typeof d.children === 'object' && d.children) {
        return d.children[key]
    }
    return undefined
}

describe('JSONPointer', () => {
    test.each([
        {
            pointer: '/arr/1',
            data: {arr: ['a', 'b']},
            value: 'b',
            pick: pick,
        },
        {
            pointer: '/obj/person/name',
            data: {obj: {person: {name: 'Jane'}}},
            value: 'Jane',
            pick: pick,
        },
        {
            pointer: '/obj/person/address/city',
            data: {obj: {person: {}}},
            value: undefined,
            pick: pick,
        },
        {
            pointer: '/arr/1',
            data: {children: {arr: {children: [1, 2]}}},
            value: 2,
            pick: pickChildren,
        },
        {
            pointer: '/obj/person/name',
            data: {children: {obj: {children: {person: {children: {name: 'Jane'}}}}}},
            value: 'Jane',
            pick: pickChildren,
        },
    ])(
        'walkPointer() %j',
        (testData) => {
            expect(
                walkPointer(testData.pointer, testData.data, testData.pick),
            ).toBe(testData.value)
        },
    )
})
