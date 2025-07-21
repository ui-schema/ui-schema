import { isSomeSchema, SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import { List, Map, Set, OrderedMap } from 'immutable'

/**
 * Get basic access to the fields of the current schema.
 *
 * @experimental new util, not yet completed, basics for Table compat with 0.4.x AND new experiment for resolving a single level of static sub-schemas, for non-validation based rendering.
 */
export function getFields(
    schema: SomeSchema,
    options?: {
        /**
         * Optional adapter to allow resolving references.
         *
         * Example on how it will be used:
         * ```js
         * const refSchemaBranch = resource?.findRef(schema.get('$ref'))
         * ```
         */
        resource?: {
            findRef: (canonicalRef: string) => { value: () => SomeSchema } | undefined
        }
    },
) {
    const itemsTmp = schema.get('items')
    const prefixItemsTmp = schema.get('prefixItems')
    const additionalItemsTmp = schema.get('additionalItems')

    const propertiesTmp = schema.get('properties')
    const patternPropertiesTmp = schema.get('patternProperties')
    const additionalPropertiesTmp = schema.get('additionalProperties')
    const propertyNamesTmp = schema.get('propertyNames')

    let prefixItems: undefined | List<any>
    let items: undefined | Map<any, any>
    let additionalItems = true

    if (prefixItemsTmp !== undefined) {
        // Draft 2019-09+: Use modern prefixItems + items
        prefixItems = prefixItemsTmp
        if (itemsTmp === false) {
            additionalItems = false
        } else if (Map.isMap(itemsTmp)) {
            items = itemsTmp // now behaves like additionalItems
        }
    } else if (List.isList(itemsTmp)) {
        // Draft-07 and below: Tuple-style items
        prefixItems = itemsTmp
        if (additionalItemsTmp === false) {
            additionalItems = false
        } else if (Map.isMap(additionalItemsTmp)) {
            items = additionalItemsTmp
        }
    } else if (itemsTmp === false) {
        // Draft-07 and below: Tuple-style items with no additional items
        additionalItems = false
    } else if (Map.isMap(itemsTmp)) {
        // Homogeneous item schema
        items = itemsTmp
    }

    let properties: undefined | Map<any, any>
    let patternProperties: undefined | Map<any, any>
    let propertyNames: undefined | Map<any, any>
    let additionalProperties = true
    let additionalPropertiesSchema: undefined | Map<any, any>

    if (Map.isMap(propertiesTmp)) {
        properties = propertiesTmp
    }

    if (additionalPropertiesTmp === false) {
        additionalProperties = false
    } else if (Map.isMap(additionalPropertiesTmp)) {
        additionalPropertiesSchema = additionalPropertiesTmp
    }

    if (Map.isMap(patternPropertiesTmp)) {
        patternProperties = patternPropertiesTmp
    }
    if (Map.isMap(propertyNamesTmp)) {
        propertyNames = propertyNamesTmp
    }

    return {
        items: items,
        prefixItems: prefixItems,
        additionalItems: additionalItems,

        properties: properties,
        patternProperties: patternProperties,
        additionalProperties: additionalProperties,
        additionalPropertiesSchema: additionalPropertiesSchema,
        propertyNames: propertyNames,

        /**
         * Get the current `schema`, with normalized static children keywords for `items`/`prefixItems`/`properties`.
         *
         * This reuses the above normalization and creates a new `schema`, with all keywords replaced.
         */
        getStaticSchema: () => {
            let newSchema = schema

            if (prefixItems?.size) {
                newSchema = newSchema.set(
                    'prefixItems',
                    prefixItems.reduce((acc, schema, i) => {
                        return acc.set(i, resolveSchema(schema, options))
                    }, List()),
                )
            } else {
                newSchema = newSchema.delete('prefixItems')
            }

            if (items) {
                newSchema = newSchema.set('items', resolveSchema(items, options))
            } else if (!additionalItems) {
                newSchema = newSchema.set('items', false)
            } else {
                newSchema = newSchema.delete('items')
            }

            // After normalizing `items` and `prefixItems`, `additionalItems` is redundant and from older drafts.
            // The presence or schema for additional items is now fully described by `items`.
            if (newSchema.has('additionalItems')) {
                newSchema = newSchema.delete('additionalItems')
            }

            if (properties?.size) {
                newSchema = newSchema.set(
                    'properties',
                    properties.reduce((acc, schema, key) => {
                        return acc.set(key, resolveSchema(schema, options))
                    }, OrderedMap()),
                )
            } else {
                newSchema = newSchema.delete('properties')
            }

            if (additionalPropertiesSchema) {
                newSchema = newSchema.set('additionalProperties', resolveSchema(additionalPropertiesSchema, options))
            } else if (!additionalProperties) {
                newSchema = newSchema.set('additionalProperties', false)
            } else {
                newSchema = newSchema.delete('additionalProperties')
            }

            if (patternProperties?.size) {
                newSchema = newSchema.set(
                    'patternProperties',
                    patternProperties.reduce((acc, schema, key) => {
                        return acc.set(key, resolveSchema(schema, options))
                    }, OrderedMap()),
                )
            } else {
                newSchema = newSchema.delete('patternProperties')
            }

            if (propertyNames) {
                newSchema = newSchema.set('propertyNames', resolveSchema(propertyNames, options))
            } else {
                newSchema = newSchema.delete('propertyNames')
            }

            // note: allOf in this level should have been already reduced beforehand!
            //       only resolved in immediate static children sub-schema.

            return newSchema
        },

        /**
         * Get the schema of immediate static fields of this schema.
         *
         * Includes resolving all non-dynamic of the one which matched:
         *
         * - `$ref` resolves the full chain, as long as possible
         * - `allOf` finds and further resolves any sub-schemas
         *
         * Returning the id of what was found (items/properties) and a `.schema` with a collection of all which where found for single-sub-schema like additionalProperties and no properties at all,
         * and a sub-tree of any allowed child-sub-schema, like with properties and prefixItems, here a `Map` from index/key of children to a list of all collected schemas for it.
         *
         * @todo refine/provide guidance about using it to get the next level
         *       - array needs value to render `.schema`
         *       - object properties and tuple-arrays can be rendered without knowing the value
         *       - object needs value to know dynamic properties (like additional)
         */
        getStaticChildren: (
            /**
             * Decide which children should be preferred, defaults to `properties`.
             *
             * When you are inside an `array`, you should prefer `items`.
             *
             * When you are inside an `object`, you should prefer `properties`.
             */
            prefer: 'items' | 'properties' = 'properties',
        ) => {
            if ((items || prefixItems) && (prefer === 'items' || !properties)) {
                return {
                    kind: 'items' as const,
                    additional: additionalItems,
                    schema:
                        items ?
                            resolveSchema(items, options) :
                            null,
                    children:
                        prefixItems?.size ?
                            prefixItems.reduce((acc, schema, i) => {
                                return acc.set(i, resolveSchema(schema, options))
                            }, OrderedMap())
                            : null,
                }
            } else if ((properties || additionalPropertiesSchema) && (prefer === 'properties' || !items)) {
                return {
                    kind: 'properties' as const,
                    additional: additionalProperties,
                    schema:
                        additionalPropertiesSchema ?
                            resolveSchema(additionalPropertiesSchema, options) :
                            null,
                    children:
                        properties?.size ?
                            properties.reduce((acc, schema, key) => {
                                return acc.set(key, resolveSchema(schema, options))
                            }, OrderedMap())
                            : null,
                }
            } else {
                // Fallback: If no direct properties or items, try to collect from allOf or $ref
                // (which isn't needed, as should be done from validator of the current schema level)
            }

            return null
        },
    }
}

/**
 * A util which collects and combines static sub-schema, for either `items` or `properties`.
 *
 * Order or resolving:
 * - first resolve the immediate existing: allOf (if/else/then etc.)
 *   - here "last-one wins": for hoisted keywords, the last existing keyword is used
 *   - for others,
 * - second resolve the "extended" schemas
 *   - here "first-one wins": for hoisted keywords, only if the keyword does not exist, it will be hoisted, otherwise added to `allOf`
 *   - each $ref, merging it, then any further $ref etc.
 *
 *  As with `combineSchema`, this function only applies static fields and does not go in other value-locations.
 *
 * @experimental
 */
export function resolveSchema(
    schema: SomeSchema,
    options?: {
        resource?: {
            findRef: (canonicalRef: string) => { value: () => SomeSchema } | undefined
        }
    },
): SomeSchema {
    // fully, recursively apply and combine allOf
    if (schema.has('allOf')) {
        const allOfSchemas = schema.get('allOf')

        schema = schema.delete('allOf')

        if (List.isList(allOfSchemas)) {
            allOfSchemas.forEach(subSchema => {
                if (!isSomeSchema(subSchema)) return
                const resolvedSubSchema = resolveSchema(subSchema, options)
                schema = combineSchema(schema, resolvedSubSchema)
            })
        }
    }

    // resolve and "extend" ref
    if (schema.has('$ref')) {
        const refSchema = options?.resource?.findRef(schema.get('$ref'))

        // todo: make ref available after merging
        schema = schema.delete('$ref')

        if (refSchema) {
            const resolvedRefSchema = resolveSchema(refSchema.value(), options)
            schema = combineSchema(schema, resolvedRefSchema, undefined, true)
        }
    }

    return schema
}

const defaultHoistKeywords = [
    'type', // intersect
    'title', // first-wins, or overwrite in allOf?
    'description', // first-wins, or overwrite in allOf?
    'view', // mergeDeep
    't', // mergeDeep
]

/**
 * Basic hoisting of some keywords and combining the sub-schema otherwise with the `allOf` strategy.
 *
 * For keywords which are not in hoistKeywords, their first appearance is hoisted, while the second if added to `allOf`.
 *
 * Except for type, where an intersection is created, while no-intersections are skipped and the last valid type is kept.
 *
 * For `properties` and `items`, their sub-schemas are merged. If a property exists in both, the one from `subSchema` is preferred. If a property in `subSchema` has a key that already exists in `baseSchema`'s properties, and their values are both maps, they are merged. If there's a conflict (e.g., a key in `subSchema`'s property value also exists in `baseSchema`'s property value), the conflicting part of `baseSchema`'s property is added to an `allOf` array within the merged schema, ensuring no information is lost.
 */
export function combineSchema(
    baseSchema: Map<any, any>,
    subSchema: Map<any, any>,
    hoistKeywords = defaultHoistKeywords,
    fallback: boolean = false,
) {
    let mergedSchema = baseSchema

    const allOfPart = OrderedMap().asMutable()

    subSchema.forEach((value, key) => {
        if (key === 'properties') {
            // special handling for 'properties', to hoist them as long as no conflict/duplicate keywords are defined,
            // but not recursively go deeper, as this must only combine the schemas for a single value-location scope.
            const baseProperties = mergedSchema.get('properties')
            if (Map.isMap(baseProperties) && Map.isMap(value)) {
                // go over all new properties and hoist those which either:
                // - do not exist in mergeSchema
                // - have no overlapping keys with the existing definition
                const mergedProperties = baseProperties.withMutations(mutableProperties => {
                    value.forEach((propValue: any, propKey: any) => {
                        if (!Map.isMap(propValue)) return

                        const existingProp = mutableProperties.get(propKey)
                        if (
                            !existingProp
                            || !Map.isMap(existingProp)
                        ) {
                            mutableProperties.set(propKey, propValue)
                        } else if (
                            !propValue.keySeq().some(key => existingProp.has(key))
                        ) {
                            mutableProperties.set(
                                propKey,
                                existingProp.merge(propValue),
                            )
                        } else {
                            allOfPart.update('properties', (properties) => {
                                return (Map.isMap(properties) ? properties as OrderedMap<any, any> : OrderedMap()).set(propKey, propValue)
                            })
                        }
                    })
                })
                mergedSchema = mergedSchema.set('properties', mergedProperties)
            } else if (!mergedSchema.has(key)) {
                mergedSchema = mergedSchema.set(key, value)
            } else {
                allOfPart.set(key, value)
            }
        } else if (key === 'items') {
            // special handling for 'items', only for non-tuple arrays;
            // it's way simpler as for `properties`, as (non-tuple) `items` is single sub-schema
            const baseItems = mergedSchema.get('items')
            if (Map.isMap(baseItems) && Map.isMap(value)) {
                // hoist non conflicting keywords, add others to allOfPart
                const allOfPartItems = OrderedMap().asMutable()
                value.forEach((subValue: any, subKeyword: any) => {
                    if (!baseItems.has(subKeyword)) {
                        mergedSchema = mergedSchema.setIn(['items', subKeyword], subValue)
                    } else {
                        allOfPartItems.set(subKeyword, subValue)
                    }
                })
                if (allOfPartItems.size) {
                    allOfPart.set(key, allOfPartItems)
                }
            } else if (!mergedSchema.has(key)) {
                mergedSchema = mergedSchema.set(key, value)
            } else {
                allOfPart.set(key, value)
            }
        } else if (hoistKeywords.includes(key)) {
            switch (key) {
                case 'type': {
                    // todo: unify behaviour between here and validation backed mergeSchema
                    const baseType = mergedSchema.get('type')
                    const subType = value
                    const baseTypes = List.isList(baseType) ? baseType.toSet() : (baseType ? Set([baseType]) : Set())
                    const subTypes = List.isList(subType) ? subType.toSet() : (subType ? Set([subType]) : Set())

                    const intersectedTypes = baseTypes.intersect(subTypes)
                    if (intersectedTypes.size === 1) {
                        mergedSchema = mergedSchema.set('type', intersectedTypes.first())
                    } else if (intersectedTypes.size > 1) {
                        mergedSchema = mergedSchema.set('type', intersectedTypes.toList())
                    } else if (baseTypes.isEmpty() && !subTypes.isEmpty()) {
                        mergedSchema = mergedSchema.set('type', subType)
                    } else if (!baseTypes.isEmpty() && subTypes.isEmpty()) {
                        // do nothing, keep baseType
                    } else {
                        // conflicting types, not changing base
                        allOfPart.set(key, value)
                    }
                    break
                }
                case 'title':
                case 'description':
                    if (!fallback || !mergedSchema.has(key)) {
                        mergedSchema = mergedSchema.set(key, value)
                    } else {
                        allOfPart.set(key, value)
                    }
                    break
                case 't':
                case 'view': {
                    // merge deep, for `fallback` invert direction
                    const existingValue = mergedSchema.get(key)
                    if (fallback) {
                        if (Map.isMap(value)) {
                            mergedSchema = mergedSchema.set(
                                key,
                                typeof existingValue === 'undefined' ?
                                    value :
                                    Map.isMap(existingValue) ?
                                        value.mergeDeep(existingValue) :
                                        existingValue,
                            )
                        } else if (!mergedSchema.has(key)) {
                            mergedSchema = mergedSchema.set(key, value)
                        }
                    } else if (Map.isMap(value)) {
                        mergedSchema = mergedSchema.set(
                            key,
                            Map.isMap(existingValue) ?
                                existingValue.mergeDeep(value) :
                                value,
                        )
                    } else {
                        mergedSchema = mergedSchema.set(key, value)
                    }
                    break
                }
                default:
                    if (!fallback || !mergedSchema.has(key)) {
                        mergedSchema = mergedSchema.set(key, value)
                    } else {
                        allOfPart.set(key, value)
                    }
                    break
            }
        } else if (!mergedSchema.has(key)) {
            mergedSchema = mergedSchema.set(key, value)
        } else {
            allOfPart.set(key, value)
        }
    })

    if (allOfPart.size) {
        mergedSchema = mergedSchema.update(
            'allOf',
            (allOf: List<any> = List()) => allOf.push(allOfPart.asImmutable()),
        )
    }

    return mergedSchema
}
