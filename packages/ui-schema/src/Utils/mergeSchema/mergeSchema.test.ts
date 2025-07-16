import { expect, describe, test } from '@jest/globals'
import { mergeSchema } from '@ui-schema/ui-schema/Utils/mergeSchema'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'

describe('mergeSchema', () => {
    /*test.each([
        [{a: 'name'}, {a: 'name'}, true],
        [{a: 'name'}, {a: 'names'}, false],
        [{a: 'name'}, {b: 'name'}, false],
        [{a: createMap({c: 'name'})}, {a: createMap({c: 'name'})}, true],
        [{a: createMap({c: 'name'})}, {a: createMap({c: 'names'})}, false],
        [{a: createMap({c: 'name'})}, {a: createMap({b: 'name'})}, false],
        [{a: List(['name'])}, {a: List(['name'])}, true],
        [{a: List(['name'])}, {a: List(['names'])}, false],
        [{a: List(['name'])}, {a: List(['name', 'street'])}, false],
        [{a: List(['name']), b: true}, {a: List(['name']), b: true}, true],
        [{a: List(['name']), b: true}, {a: List(['name']), b: false}, false],
    ])(
        'isEqual(%j, %s)',
        (prevProps, nextProps, expectedValid) => {
            expect(isEqual(prevProps, nextProps)).toBe(expectedValid)
        },
    )*/

    test('type', () => {
        const merged = mergeSchema(createOrderedMap({type: 'string'}), createOrderedMap({type: 'number'}))
        expect(merged.get('type')).toEqual('number')
    })
    test('format', () => {
        const merged = mergeSchema(createOrderedMap({format: 'email'}), createOrderedMap({format: 'text'}))
        expect(merged.get('format')).toEqual('text')
    })
    test('properties 1', () => {
        const merged = mergeSchema(createOrderedMap({
            type: 'object',
        }), createOrderedMap({
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                },
            },
        }))
        expect(createOrderedMap({
            name: {
                type: 'string',
            },
        }).equals(merged.get('properties'))).toEqual(true)
    })
    test('properties 2', () => {
        const merged = mergeSchema(createOrderedMap({
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                },
            },
        }), createOrderedMap({
            type: 'object',
        }))
        expect(createOrderedMap({
            name: {
                type: 'string',
            },
        }).equals(merged.get('properties'))).toEqual(true)
    })
    test('properties 3', () => {
        const merged = mergeSchema(createOrderedMap({
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    maxLength: 20,
                },
            },
        }), createOrderedMap({
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    maxLength: 25,
                    format: 'email',
                },
            },
        }))
        expect(createOrderedMap({
            name: {
                type: 'string',
                maxLength: 25,
                format: 'email',
            },
        }).equals(merged.get('properties'))).toEqual(true)
    })
    test('required 1', () => {
        const merged = mergeSchema(createOrderedMap({
            type: 'object',
            required: ['name'],
        }), createOrderedMap({
            type: 'object',
        }))
        expect(createOrderedMap({
            type: 'object',
            required: ['name'],
        }).equals(merged)).toEqual(true)
    })
    test('required 2', () => {
        const merged = mergeSchema(createOrderedMap({
            type: 'object',
        }), createOrderedMap({
            type: 'object',
            required: ['name'],
        }))
        expect(createOrderedMap({
            type: 'object',
            required: ['name'],
        }).equals(merged)).toEqual(true)
    })
    test('required 3', () => {
        const merged = mergeSchema(createOrderedMap({
            type: 'object',
            required: ['email'],
        }), createOrderedMap({
            type: 'object',
            required: ['name'],
        }))
        expect(createOrderedMap({
            type: 'object',
            required: ['email', 'name'],
        }).equals(merged)).toEqual(true)
    })
    test('widget', () => {
        const merged = mergeSchema(createOrderedMap({
            widget: 'SimpleList',
        }), createOrderedMap({
            widget: 'GenericList',
        }))
        expect(createOrderedMap({
            widget: 'GenericList',
        }).equals(merged)).toEqual(true)
    })
    test('enum 1', () => {
        const merged = mergeSchema(createOrderedMap({
            enum: ['demo'],
        }), createOrderedMap({
            enum: ['muster'],
        }))
        expect(createOrderedMap({
            enum: ['demo', 'muster'],
        }).equals(merged)).toEqual(true)
    })
    test('enum 2', () => {
        const merged = mergeSchema(createOrderedMap({
            enum: ['demo'],
        }), createOrderedMap({}))
        expect(createOrderedMap({
            enum: ['demo'],
        }).equals(merged)).toEqual(true)
    })
    test('const 1', () => {
        const merged = mergeSchema(createOrderedMap({
            const: 'demo',
        }), createOrderedMap({
            const: 'muster',
        }))
        expect(createOrderedMap({
            const: 'muster',
        }).equals(merged)).toEqual(true)
    })
    test('const 2', () => {
        const merged = mergeSchema(createOrderedMap({
            const: 'demo',
        }), createOrderedMap({}))
        expect(createOrderedMap({
            const: 'demo',
        }).equals(merged)).toEqual(true)
    })
    test('not', () => {
        const merged = mergeSchema(createOrderedMap({
            not: {},
        }), createOrderedMap({
            not: {
                type: 'string',
            },
        }))
        expect(createOrderedMap({
            not: {
                type: 'string',
            },
        }).equals(merged)).toEqual(true)
    })
})
