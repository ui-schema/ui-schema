import { expect, describe, test } from '@jest/globals'
import { fromJSOrdered } from '@ui-schema/ui-schema/createMap'
import { Map, List, OrderedMap } from 'immutable'
import { getFields, resolveSchema, combineSchema } from './getFields.js'
import { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'

/**
 * npm run tdd -- --testPathPattern=getFields --selectProjects=test-@ui-schema/ui-schema
 */

// Helper to create an immutable schema from a plain JS object for testing
const createSchema = (obj: object): SomeSchema => fromJSOrdered(obj)

describe('getFields', () => {
    describe('Object Schemas', () => {
        test('should parse basic properties with default additionalProperties', () => {
            const schema = createSchema({
                type: 'object',
                properties: {
                    name: {type: 'string'},
                },
            })
            const fields = getFields(schema)
            expect(Map.isMap(fields.properties)).toBe(true)
            expect(fields.properties?.getIn(['name', 'type'])).toBe('string')
            expect(fields.additionalProperties).toBe(true)
            expect(fields.additionalPropertiesSchema).toBeUndefined()
        })

        test('should parse properties with additionalProperties: false', () => {
            const schema = createSchema({
                type: 'object',
                properties: {name: {type: 'string'}},
                additionalProperties: false,
            })
            const fields = getFields(schema)
            expect(fields.additionalProperties).toBe(false)
        })

        test('should parse properties with additionalProperties as a schema', () => {
            const schema = createSchema({
                type: 'object',
                properties: {name: {type: 'string'}},
                additionalProperties: {type: 'number'},
            })
            const fields = getFields(schema)
            expect(fields.additionalProperties).toBe(true)
            expect(Map.isMap(fields.additionalPropertiesSchema)).toBe(true)
            expect(fields.additionalPropertiesSchema?.get('type')).toBe('number')
        })

        test('should parse patternProperties and propertyNames', () => {
            const schema = createSchema({
                type: 'object',
                patternProperties: {
                    '^S_': {type: 'string'},
                },
                propertyNames: {
                    pattern: '^[A-Za-z_][A-Za-z0-9_]*$',
                },
            })
            const fields = getFields(schema)
            expect(Map.isMap(fields.patternProperties)).toBe(true)
            expect(fields.patternProperties?.getIn(['^S_', 'type'])).toBe('string')
            expect(Map.isMap(fields.propertyNames)).toBe(true)
            expect(fields.propertyNames?.get('pattern')).toBe('^[A-Za-z_][A-Za-z0-9_]*$')
        })
    })

    describe('Array Schemas', () => {
        // Draft 2019-09+ (prefixItems)
        test('should parse prefixItems and items for additional items (Draft 2019-09+)', () => {
            const schema = createSchema({
                type: 'array',
                prefixItems: [{type: 'string'}, {type: 'number'}],
                items: {type: 'boolean'},
            })
            const fields = getFields(schema)
            expect(List.isList(fields.prefixItems)).toBe(true)
            expect(fields.prefixItems?.size).toBe(2)
            expect(fields.prefixItems?.getIn([0, 'type'])).toBe('string')
            expect(Map.isMap(fields.items)).toBe(true)
            expect(fields.items?.get('type')).toBe('boolean')
            expect(fields.additionalItems).toBe(true)
        })

        test('should parse prefixItems with no additional items (items: false)', () => {
            const schema = createSchema({
                type: 'array',
                prefixItems: [{type: 'string'}],
                items: false,
            })
            const fields = getFields(schema)
            expect(List.isList(fields.prefixItems)).toBe(true)
            expect(fields.prefixItems?.size).toBe(1)
            expect(fields.items).toBeUndefined()
            expect(fields.additionalItems).toBe(false)
        })

        // Draft-07 and below (items array)
        test('should parse tuple-style items and additionalItems as a schema (Draft-07)', () => {
            const schema = createSchema({
                type: 'array',
                items: [{type: 'string'}, {type: 'number'}],
                additionalItems: {type: 'boolean'},
            })
            const fields = getFields(schema)
            expect(List.isList(fields.prefixItems)).toBe(true)
            expect(fields.prefixItems?.size).toBe(2)
            expect(fields.prefixItems?.getIn([1, 'type'])).toBe('number')
            expect(Map.isMap(fields.items)).toBe(true)
            expect(fields.items?.get('type')).toBe('boolean')
            expect(fields.additionalItems).toBe(true)
        })

        test('should parse tuple-style items with no additional items (additionalItems: false)', () => {
            const schema = createSchema({
                type: 'array',
                items: [{type: 'string'}],
                additionalItems: false,
            })
            const fields = getFields(schema)
            expect(List.isList(fields.prefixItems)).toBe(true)
            expect(fields.prefixItems?.size).toBe(1)
            expect(fields.items).toBeUndefined()
            expect(fields.additionalItems).toBe(false)
        })

        test('should parse items: false as an array with no items allowed (Draft-07)', () => {
            const schema = createSchema({
                type: 'array',
                items: false,
            })
            const fields = getFields(schema)
            expect(fields.prefixItems).toBeUndefined()
            expect(fields.items).toBeUndefined()
            expect(fields.additionalItems).toBe(false)
        })

        // Homogeneous arrays
        test('should parse homogeneous items as a single schema', () => {
            const schema = createSchema({
                type: 'array',
                items: {type: 'string'},
            })
            const fields = getFields(schema)
            expect(fields.prefixItems).toBeUndefined()
            expect(Map.isMap(fields.items)).toBe(true)
            expect(fields.items?.get('type')).toBe('string')
            expect(fields.additionalItems).toBe(true)
        })
    })

    describe('getStaticSchema method', () => {
        const resource = {
            findRef: (canonicalRef: string) => {
                if (canonicalRef === '#/definitions/name') {
                    return {value: () => createSchema({title: 'From Ref', type: 'string'})}
                }
                if (canonicalRef === '#/definitions/age') {
                    return {value: () => createSchema({type: 'number', minimum: 0})}
                }
                if (canonicalRef === '#/definitions/propNameSchema') {
                    return {value: () => createSchema({type: 'string', minLength: 3})}
                }
                return undefined
            },
        }

        test('should normalize a basic object schema, resolving refs in properties', () => {
            const schema = createSchema({
                type: 'object',
                properties: {
                    name: {$ref: '#/definitions/name'},
                    email: {type: 'string', format: 'email'},
                },
            })
            const staticSchema = getFields(schema, {resource}).getStaticSchema()
            expect(staticSchema.toJS()).toStrictEqual({
                type: 'object',
                properties: {
                    name: {title: 'From Ref', type: 'string'},
                    email: {type: 'string', format: 'email'},
                },
            })
        })

        test('should normalize a Draft-07 tuple array to a Draft-2019-09 schema', () => {
            const schema = createSchema({
                type: 'array',
                items: [
                    {type: 'string'},
                    {$ref: '#/definitions/age'},
                ],
                additionalItems: {type: 'boolean'},
            })
            const staticSchema = getFields(schema, {resource}).getStaticSchema()
            // The old `items` (tuple) and `additionalItems` should be normalized to `prefixItems` and `items`
            // and the `additionalItems` keyword should be removed.
            expect(staticSchema.toJS()).toStrictEqual({
                type: 'array',
                prefixItems: [
                    {type: 'string'},
                    {type: 'number', minimum: 0},
                ],
                items: {type: 'boolean'},
            })
        })

        test('should handle items: false correctly', () => {
            const schema = createSchema({
                type: 'array',
                items: false,
            })
            const staticSchema = getFields(schema).getStaticSchema()
            expect(staticSchema.toJS()).toStrictEqual({
                type: 'array',
                items: false,
            })
        })

        test('should handle a modern array schema with prefixItems and items', () => {
            const schema = createSchema({
                type: 'array',
                prefixItems: [
                    {type: 'string'},
                    {$ref: '#/definitions/age'},
                ],
                items: {$ref: '#/definitions/name'},
            })
            const staticSchema = getFields(schema, {resource}).getStaticSchema()
            expect(staticSchema.toJS()).toStrictEqual({
                type: 'array',
                prefixItems: [
                    {type: 'string'},
                    {type: 'number', minimum: 0},
                ],
                items: {title: 'From Ref', type: 'string'},
            })
        })

        test('should correctly handle additionalProperties and patternProperties with refs', () => {
            const schema = createSchema({
                type: 'object',
                patternProperties: {
                    '^S_': {$ref: '#/definitions/name'},
                },
                additionalProperties: {$ref: '#/definitions/age'},
            })
            const staticSchema = getFields(schema, {resource}).getStaticSchema()
            expect(staticSchema.toJS()).toStrictEqual({
                type: 'object',
                patternProperties: {
                    '^S_': {title: 'From Ref', type: 'string'},
                },
                additionalProperties: {type: 'number', minimum: 0},
            })
        })

        test('should preserve a simple propertyNames schema', () => {
            const schema = createSchema({
                type: 'object',
                propertyNames: {
                    pattern: '^[A-Za-z_]+$',
                },
            })
            const staticSchema = getFields(schema).getStaticSchema()
            expect(staticSchema.toJS()).toStrictEqual({
                type: 'object',
                propertyNames: {
                    pattern: '^[A-Za-z_]+$',
                },
            })
        })

        test('should resolve refs within propertyNames', () => {
            const schema = createSchema({
                type: 'object',
                propertyNames: {$ref: '#/definitions/propNameSchema'},
            })
            const staticSchema = getFields(schema, {resource}).getStaticSchema()
            expect(staticSchema.toJS()).toStrictEqual({
                type: 'object',
                propertyNames: {type: 'string', minLength: 3},
            })
        })

        test('should handle additionalProperties: false', () => {
            const schema = createSchema({
                type: 'object',
                properties: {
                    name: {type: 'string'},
                },
                additionalProperties: false,
            })
            const staticSchema = getFields(schema).getStaticSchema()
            expect(staticSchema.toJS()).toStrictEqual({
                type: 'object',
                properties: {
                    name: {type: 'string'},
                },
                additionalProperties: false,
            })
        })

        test('should remove keywords for empty or default static children', () => {
            const schema = createSchema({
                type: 'object',
                properties: {}, // empty
                additionalProperties: true, // default, should be removed
            })
            const staticSchema = getFields(schema).getStaticSchema()
            expect(staticSchema.toJS()).toStrictEqual({
                type: 'object',
            })
        })

        test('should handle a schema with no children keywords', () => {
            const schema = createSchema({
                type: 'string',
                minLength: 5,
            })
            const staticSchema = getFields(schema).getStaticSchema()
            // The schema should be unchanged as it has no keywords to normalize
            expect(staticSchema.toJS()).toStrictEqual({
                type: 'string',
                minLength: 5,
            })
        })
    })

    describe('getStaticChildren method', () => {
        test('should return properties for an object schema', () => {
            const schema = createSchema({
                type: 'object',
                properties: {
                    name: {type: 'string', title: 'Name'},
                },
                additionalProperties: {type: 'number'},
            })
            const childrenInfo = getFields(schema).getStaticChildren()
            expect(childrenInfo?.kind).toBe('properties')
            expect(childrenInfo?.additional).toBe(true)
            expect(childrenInfo?.schema?.get('type')).toBe('number')
            expect(childrenInfo?.children?.toJS()).toStrictEqual({
                name: {
                    type: 'string',
                    title: 'Name',
                },
            })
        })

        test('should return items for an array schema', () => {
            const schema = createSchema({
                type: 'array',
                prefixItems: [{type: 'string', title: 'First'}],
                items: {type: 'boolean'},
            })
            const childrenInfo = getFields(schema).getStaticChildren()
            expect(childrenInfo?.kind).toBe('items')
            expect(childrenInfo?.additional).toBe(true)
            expect(childrenInfo?.schema?.get('type')).toBe('boolean')
            expect(childrenInfo?.children?.getIn([0, 'title'])).toBe('First')
        })

        test('should return null for children when only additionalProperties is defined', () => {
            const schema = createSchema({
                type: 'object',
                additionalProperties: {type: 'number'},
            })
            const childrenInfo = getFields(schema).getStaticChildren()
            expect(childrenInfo?.kind).toBe('properties')
            expect(childrenInfo?.additional).toBe(true)
            expect(childrenInfo?.schema?.get('type')).toBe('number')
            expect(childrenInfo?.children).toBeNull()
        })

        test('should return null for children when only items is defined (no prefixItems)', () => {
            const schema = createSchema({
                type: 'array',
                items: {type: 'boolean'},
            })
            const childrenInfo = getFields(schema).getStaticChildren()
            expect(childrenInfo?.kind).toBe('items')
            expect(childrenInfo?.additional).toBe(true)
            expect(childrenInfo?.schema?.get('type')).toBe('boolean')
            expect(childrenInfo?.children).toBeNull()
        })

        test('should respect the "prefer" argument', () => {
            const schema = createSchema({
                type: ['object', 'array'],
                properties: {name: {type: 'string'}},
                prefixItems: [{type: 'number'}],
            })
            const fields = getFields(schema)
            const propsChildren = fields.getStaticChildren('properties')
            const itemsChildren = fields.getStaticChildren('items')

            expect(propsChildren?.kind).toBe('properties')
            expect(itemsChildren?.kind).toBe('items')
            expect(propsChildren?.children?.getIn(['name', 'type'])).toBe('string')
            expect(itemsChildren?.children?.getIn([0, 'type'])).toBe('number')
        })

        test('should return properties when schema supports both object and array but only has properties', () => {
            const schema = createSchema({
                type: ['object', 'array'],
                properties: {name: {type: 'string'}},
            })
            const childrenInfo = getFields(schema).getStaticChildren() // prefer defaults to 'properties'
            expect(childrenInfo?.kind).toBe('properties')
            expect(childrenInfo?.children?.has('name')).toBe(true)
        })

        test('should return properties when prefer="items" but no items are defined', () => {
            const schema = createSchema({
                type: ['object', 'array'],
                properties: {name: {type: 'string'}},
            })
            // even when `items` is preferred, it falls back to `properties` if they exist and `items` do not
            const childrenInfo = getFields(schema).getStaticChildren('items')
            expect(childrenInfo?.kind).toBe('properties')
            expect(childrenInfo?.children?.has('name')).toBe(true)
        })

        test('should return null if no static children are defined', () => {
            const schema = createSchema({type: 'string'})
            const childrenInfo = getFields(schema).getStaticChildren()
            expect(childrenInfo).toBeNull()
        })

        test('should resolve and combine schemas within getStaticChildren', () => {
            const refSchema = createSchema({title: 'From Ref', minLength: 2})
            const resource = {
                findRef: (canonicalRef: string) => {
                    if (canonicalRef === '#/definitions/name') {
                        return {value: () => refSchema}
                    }
                    return undefined
                },
            }
            const schema = createSchema({
                type: 'object',
                properties: {
                    name: {
                        allOf: [
                            {$ref: '#/definitions/name'},
                            {description: 'A name'},
                        ],
                    },
                },
            })

            const childrenInfo = getFields(schema, {resource}).getStaticChildren()
            const nameSchema = childrenInfo?.children?.get('name') as OrderedMap<any, any>

            expect(nameSchema?.get('title')).toBe('From Ref')
            expect(nameSchema?.get('description')).toBe('A name')
            expect(nameSchema?.get('minLength')).toBe(2)
        })
    })
})

describe('resolveSchema', () => {
    const refContent = createSchema({title: 'My Ref', type: 'string'})
    const refWithAllOf = createSchema({
        title: 'Ref with allOf',
        allOf: [{minLength: 10}],
    })
    const resource = {
        findRef: (ref: string) => {
            if (ref === '#/def/my-ref') return {value: () => refContent}
            if (ref === '#/def/ref-with-allof') return {value: () => refWithAllOf}
            return undefined
        },
    }

    interface TestCase {
        description: string
        schema: any
        expected: any
        options?: {
            resource?: {
                findRef: (canonicalRef: string) => { value: () => SomeSchema } | undefined
            }
        }
    }

    test.each<TestCase>([
        {
            description: 'should return same schema if no $ref or allOf',
            schema: {type: 'string', minLength: 1},
            expected: {type: 'string', minLength: 1},
        },
        {
            description: 'should resolve a simple $ref',
            schema: {$ref: '#/def/my-ref', description: 'Test'},
            options: {resource},
            expected: {title: 'My Ref', type: 'string', description: 'Test'},
        },
        {
            description: 'should handle a non-existent $ref gracefully',
            schema: {$ref: '#/def/non-existent', description: 'Test'},
            options: {resource},
            expected: {description: 'Test'},
        },
        {
            description: 'should resolve a simple allOf',
            schema: {
                type: 'string',
                allOf: [{minLength: 5}, {maxLength: 10}],
            },
            expected: {type: 'string', minLength: 5, maxLength: 10},
        },
        {
            description: 'should flatten nested allOf schemas',
            schema: {
                type: 'object',
                allOf: [
                    {properties: {name: {type: 'string'}}},
                    {
                        allOf: [
                            {properties: {age: {type: 'number'}}},
                            {properties: {city: {type: 'string'}}},
                        ],
                    },
                ],
            },
            expected: {
                type: 'object',
                properties: {
                    name: {type: 'string'},
                    age: {type: 'number'},
                    city: {type: 'string'},
                },
            },
        },
        {
            description: 'should resolve a $ref within an allOf',
            schema: {
                allOf: [
                    {$ref: '#/def/my-ref'},
                    {description: 'Combined'},
                ],
            },
            options: {resource},
            expected: {
                title: 'My Ref',
                type: 'string',
                description: 'Combined',
            },
        },
        {
            description: 'should resolve an allOf within a $ref target',
            schema: {$ref: '#/def/ref-with-allof', maxLength: 20},
            options: {resource},
            expected: {
                title: 'Ref with allOf',
                minLength: 10,
                maxLength: 20,
            },
        },
    ])(
        'resolveSchema - $description',
        async (
            {
                schema,
                expected,
                options,
            },
        ) => {
            const resolved = resolveSchema(
                fromJSOrdered(schema),
                options,
            )
            expect(resolved.toJS()).toStrictEqual(expected)
        },
    )
})

describe('combineSchema', () => {
    interface TestCase {
        description: string
        base: any
        sub: any
        expected: any
        hoistKeywords?: string[]
        fallback?: boolean
    }

    test.each<TestCase>([
        {
            description: 'should hoist title and description, sub wins',
            base: {title: 'Base'},
            sub: {title: 'Sub', description: 'Sub Desc'},
            expected: {title: 'Sub', description: 'Sub Desc'},
        },
        {
            description: 'should not overwrite title/desc when fallback=true',
            base: {title: 'Base', description: 'Base Desc'},
            sub: {title: 'Sub', description: 'Sub Desc'},
            fallback: true,
            expected: {
                title: 'Base',
                description: 'Base Desc',
                allOf: [{title: 'Sub', description: 'Sub Desc'}],
            },
        },
        {
            description: 'should deep merge "t", sub wins',
            base: {t: {title: 'base-title'}},
            sub: {t: {title: 'sub-title'}},
            expected: {t: {title: 'sub-title'}},
        },
        {
            description: 'should deep merge "view", sub wins',
            base: {view: {icon: 'base-icon', size: 'm'}},
            sub: {view: {label: 'sub-label', size: 'l'}},
            expected: {view: {icon: 'base-icon', label: 'sub-label', size: 'l'}},
        },
        {
            description: 'should deep merge "view" with fallback=true, base wins',
            base: {view: {icon: 'base-icon', size: 'm', label: 'base-label'}},
            sub: {view: {label: 'sub-label', size: 'l'}},
            fallback: true,
            expected: {view: {icon: 'base-icon', label: 'base-label', size: 'm'}},
        },
        {
            description: 'should overwrite incompatible "view", sub wins; fallback=false',
            base: {view: null},
            sub: {view: {label: 'sub-label', size: 'l'}},
            fallback: false,
            expected: {view: {label: 'sub-label', size: 'l'}},
        },
        {
            description: 'should not overwrite incompatible "view", base wins; fallback=true',
            base: {view: null},
            sub: {view: {label: 'sub-label', size: 'l'}},
            fallback: true,
            expected: {view: null},
        },
        {
            description: 'should not overwrite incompatible "view", sub wins; fallback=true',
            base: {view: {icon: 'base-icon', size: 'm', label: 'base-label'}},
            sub: {view: null},
            fallback: true,
            expected: {view: {icon: 'base-icon', size: 'm', label: 'base-label'}},
        },
        {
            description: 'should overwrite incompatible "view", sub wins; fallback=false',
            base: {view: {icon: 'base-icon', size: 'm', label: 'base-label'}},
            sub: {view: null},
            fallback: false,
            expected: {view: null},
        },
        {
            description: 'should hoist "view", sub wins; fallback=false',
            base: {},
            sub: {view: {label: 'sub-label', size: 'l'}},
            fallback: false,
            expected: {view: {label: 'sub-label', size: 'l'}},
        },
        {
            description: 'should hoist "view", sub wins; fallback=true',
            base: {},
            sub: {view: {label: 'sub-label', size: 'l'}},
            fallback: true,
            expected: {view: {label: 'sub-label', size: 'l'}},
        },
        {
            description: 'should intersect compatible types to single type',
            base: {type: ['string', 'number']},
            sub: {type: ['number', 'null']},
            expected: {type: 'number'},
        },
        {
            description: 'should intersect compatible types to a list',
            base: {type: ['string', 'number', 'boolean']},
            sub: {type: ['number', 'null', 'boolean']},
            expected: {type: ['boolean', 'number']},
        },
        {
            description: 'does simplify type if intersected and results in one result',
            base: {type: ['number']},
            sub: {type: ['number']},
            expected: {type: 'number'},
        },
        {
            description: 'does keep type if only one is in the array, in base',
            base: {type: ['number']},
            sub: {},
            expected: {type: ['number']},
        },
        {
            description: 'does keep type if only one is in the array, in sub',
            base: {},
            sub: {type: ['number']},
            expected: {type: ['number']},
        },
        {
            description: 'does keep array type in base',
            base: {type: ['string', 'number']},
            sub: {},
            expected: {type: ['string', 'number']},
        },
        {
            description: 'does keep array type in sub',
            base: {},
            sub: {type: ['string', 'number']},
            expected: {type: ['string', 'number']},
        },
        {
            description: 'does keep string type in base',
            base: {type: 'string'},
            sub: {},
            expected: {type: 'string'},
        },
        {
            description: 'does keep string type in sub',
            base: {},
            sub: {type: 'string'},
            expected: {type: 'string'},
        },
        {
            description: 'does ignore null type in base',
            base: {type: null},
            sub: {type: 'string'},
            expected: {type: 'string'},
        },
        {
            description: 'does ignore null type in sub',
            base: {type: 'string'},
            sub: {type: null},
            expected: {type: 'string'},
        },
        {
            description: 'should move conflicting types to allOf',
            base: {type: 'string'},
            sub: {type: 'number'},
            expected: {type: 'string', allOf: [{type: 'number'}]},
        },
        {
            description: 'should adopt type if base has none',
            base: {minLength: 1},
            sub: {type: 'string'},
            expected: {minLength: 1, type: 'string'},
        },
        {
            description: 'should keep base type if sub has none',
            base: {type: 'string'},
            sub: {minLength: 1},
            expected: {type: 'string', minLength: 1},
        },
        {
            description: 'should merge non-conflicting properties',
            base: {type: 'object', properties: {name: {type: 'string'}}},
            sub: {properties: {age: {type: 'number'}}},
            expected: {type: 'object', properties: {name: {type: 'string'}, age: {type: 'number'}}},
        },
        {
            description: 'should merge non-conflicting keywords into existing property',
            base: {properties: {name: {type: 'string'}}},
            sub: {properties: {name: {minLength: 2}}},
            expected: {properties: {name: {type: 'string', minLength: 2}}},
        },
        {
            description: 'should move conflicting property definitions to allOf',
            base: {properties: {name: {type: 'string', minLength: 10}}},
            sub: {properties: {name: {type: 'string', minLength: 5}}},
            expected: {
                properties: {name: {type: 'string', minLength: 10}},
                allOf: [{properties: {name: {type: 'string', minLength: 5}}}],
            },
        },
        {
            description: 'should merge non-conflicting keywords into items',
            base: {items: {type: 'string'}},
            sub: {items: {minLength: 2}},
            expected: {items: {type: 'string', minLength: 2}},
        },
        {
            description: 'should move conflicting item keywords to allOf',
            base: {items: {type: 'string', minLength: 10}},
            sub: {items: {minLength: 5}},
            expected: {
                items: {type: 'string', minLength: 10},
                allOf: [{items: {minLength: 5}}],
            },
        },
        {
            description: 'should add new non-hoisted properties to merged schema',
            base: {minLength: 10},
            sub: {maxLength: 20},
            expected: {minLength: 10, maxLength: 20},
        },
        {
            description: 'should move conflicting non-hoisted properties to allOf',
            base: {minLength: 10},
            sub: {minLength: 5},
            expected: {minLength: 10, allOf: [{minLength: 5}]},
        },
        {
            description: 'should append to existing allOf',
            base: {minLength: 10, allOf: [{default: 'a'}]},
            sub: {minLength: 5},
            expected: {minLength: 10, allOf: [{default: 'a'}, {minLength: 5}]},
        },
        {
            description: 'should add "view" keyword if not present in base',
            base: {type: 'string'},
            sub: {view: {size: 'm'}},
            expected: {type: 'string', view: {size: 'm'}},
        },
        {
            description: 'should add "view" keyword if not present in base, even with fallback=true',
            base: {type: 'string'},
            sub: {view: {size: 'm'}},
            fallback: true,
            expected: {type: 'string', view: {size: 'm'}},
        },
        {
            description: 'should move entire conflicting property to allOf when fallback=true',
            base: {type: 'object', properties: {name: {type: 'string', minLength: 10}}},
            sub: {properties: {name: {minLength: 5, maxLength: 20}}},
            fallback: true,
            expected: {
                type: 'object',
                properties: {name: {type: 'string', minLength: 10}},
                allOf: [{properties: {name: {minLength: 5, maxLength: 20}}}],
            },
        },
        {
            description: 'should move conflicting items schema to allOf when fallback=true',
            base: {type: 'array', items: {type: 'string', minLength: 10}},
            sub: {items: {minLength: 5}},
            fallback: true,
            expected: {
                type: 'array',
                items: {type: 'string', minLength: 10},
                allOf: [{items: {minLength: 5}}],
            },
        },
        {
            description: 'should move conflicting generic keyword to allOf when fallback=true',
            base: {minLength: 10},
            sub: {minLength: 5},
            fallback: true,
            expected: {minLength: 10, allOf: [{minLength: 5}]},
        },
        {
            description: 'should move properties to allOf if base properties is not a map',
            base: {type: 'object', properties: true},
            sub: {properties: {name: {type: 'string'}}},
            expected: {
                type: 'object',
                properties: true,
                allOf: [{properties: {name: {type: 'string'}}}],
            },
        },
        {
            description: 'should add items if base schema does not have it',
            base: {type: 'array'},
            sub: {items: {type: 'string'}},
            expected: {type: 'array', items: {type: 'string'}},
        },
        {
            description: 'should move items to allOf if base items is not a map (e.g. a list for tuples)',
            base: {type: 'array', items: [{type: 'string'}]},
            sub: {items: {type: 'number'}},
            expected: {
                type: 'array',
                items: [{type: 'string'}],
                allOf: [{items: {type: 'number'}}],
            },
        },
        {
            description: 'should hoist a custom keyword, sub wins',
            base: {default: 'base'},
            sub: {default: 'sub'},
            hoistKeywords: ['default'],
            expected: {default: 'sub'},
        },
        {
            description: 'should move a custom hoisted keyword to allOf when fallback=true',
            base: {default: 'base'},
            sub: {default: 'sub'},
            hoistKeywords: ['default'],
            fallback: true,
            expected: {default: 'base', allOf: [{default: 'sub'}]},
        },
    ])(
        'combineSchema - $description',
        async (
            {
                base,
                sub,
                expected,
                hoistKeywords,
                fallback,
            },
        ) => {
            const merged = combineSchema(
                fromJSOrdered(base),
                fromJSOrdered(sub),
                hoistKeywords,
                fallback,
            )
            expect(merged.toJS()).toStrictEqual(expected)
        },
    )
})
