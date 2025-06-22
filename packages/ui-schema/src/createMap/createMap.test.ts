import { expect, describe, test } from '@jest/globals'
import { createMap, createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { List, Map, OrderedMap } from 'immutable'

describe('createMap', () => {
    test('createMap plain', () => {
        const map = createMap({})
        expect(Map.isMap(map) && !OrderedMap.isOrderedMap(map)).toEqual(true)
    })

    test('createMap nested', () => {
        const map = createMap({
            list: [],
            map: {},
        })
        expect(Map.isMap(map.get('map')) && !OrderedMap.isOrderedMap(map.get('map'))).toEqual(true)
        expect(List.isList(map.get('list'))).toEqual(true)
    })
})

describe('createOrderedMap', () => {
    test('createOrderedMap plain', () => {
        const map = createOrderedMap({})
        expect(Map.isMap(map) && OrderedMap.isOrderedMap(map)).toEqual(true)
    })

    test('createOrderedMap nested', () => {
        const map = createOrderedMap({
            list: [],
            map: {},
        })
        expect(Map.isMap(map.get('map')) && OrderedMap.isOrderedMap(map.get('map'))).toEqual(true)
        expect(List.isList(map.get('list'))).toEqual(true)
    })
})
