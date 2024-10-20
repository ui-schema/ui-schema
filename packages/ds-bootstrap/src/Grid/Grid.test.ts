import { expect, describe, test } from '@jest/globals'
import { createMap } from '@ui-schema/system/createMap'
import { getGridClasses } from '@ui-schema/ds-bootstrap/Grid'

describe('getGridClasses', () => {
    test('return type', () => {
        expect(Array.isArray(getGridClasses(createMap({})))).toBe(true)
    })

    test('array lengths', () => {
        expect(getGridClasses(createMap({view: {'sizeXs': 1}}))).toHaveLength(1)
        expect(getGridClasses(createMap({view: {'sdjfsfjs': 1}}))).toHaveLength(1)
        expect(getGridClasses(createMap({view: {'sizeMd': 2}}))).toHaveLength(2)
        expect(getGridClasses(createMap({view: {'sizeXs': 1, 'sizeMd': 2, 'sizeSm': 2, 'sizeLg': 2, 'sizeXl': 2}}))).toHaveLength(5)
        expect(getGridClasses(createMap({}))).toHaveLength(1)
    })

    test('grid classes', () => {
        expect(getGridClasses(createMap({view: {'sizeXs': 1}}))).toStrictEqual(['col-1'])
        expect(getGridClasses(createMap({view: {'sizeXs': 1, 'sizeMd': 2, 'sizeSm': 2, 'sizeLg': 2, 'sizeXl': 2}})))
            .toStrictEqual(['col-1','col-sm-2', 'col-md-2',  'col-lg-2', 'col-xl-2'])
    })
})


