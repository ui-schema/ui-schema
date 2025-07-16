import type { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { isSomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import { createOrdered } from '@ui-schema/ui-schema/createMap'
import type { SchemaPlugin } from '@ui-schema/ui-schema/SchemaPlugin'
import type { SchemaResource } from '@ui-schema/ui-schema/SchemaResource'
import { is, List, Map, OrderedMap, Set } from 'immutable'

const findMax = (currentVal: number | undefined, newVal: any): number | undefined => {
    if (typeof newVal === 'number') {
        return typeof currentVal === 'number' ? Math.max(currentVal, newVal) : newVal
    }

    return currentVal
}

const findMin = (currentVal: number | undefined, newVal: any): number | undefined => {
    if (typeof newVal === 'number') {
        return typeof currentVal === 'number' ? Math.min(currentVal, newVal) : newVal
    }

    return currentVal
}

const isFiniteNumber =
    (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n)

const getScale = (n: number): number => {
    const s = n.toString().split('.')[1]
    return s ? 10 ** s.length : 1
}

const getGCD =
    (a: bigint, b: bigint): bigint =>
        b === 0n ? a : getGCD(b, a % b)

const getLCM =
    (a: bigint, b: bigint): bigint =>
        (a * b) / getGCD(a, b)

export const findLeastCommonMultiple = (...values: number[]): number => {
    if (!values.every(isFiniteNumber)) throw new Error('Non-finite input')
    if (values.includes(0)) return 0

    const scaleFactors = values.map(getScale)
    const overallScale = scaleFactors.reduce((a, b) => a * b, 1)

    const intValues = values.map(v => BigInt(Math.round(v * overallScale)))

    return Number(intValues.reduce((a, b) => getLCM(a, b))) / overallScale
}

/**
 * @todo rewrite as a more reliable schema-reduction, only a first PoC scribble
 *       - `properties` should only be needed to be merged in first level, but if a property exists in multiple
 *         applied schemas, their schema could be added as `allOf`, to not merge lower levels directly but once that property is rendered
 *       - similar for `items`/`prefixItems`
 *          - especially tuple type items must not be concatenated, maybe build an intersection
 *       - merge all `required` into a single list
 *       - `enum` must be reduced to their intersection
 *          - same for minLength/maxLength and all other validation keywords where this is possible
 *       - conflicting `const` must be kept, to apply as `allOf.const`
 *          - same for `pattern` and all other validation keywords here no intersection can be produced
 *          - BUT WHY? validation for this level has already happened, all `const` don't need to be available for anything atm.
 *            does this mean, all already validated and non-rendering-influencing keywords should be handled? what/where to decide?
 * @todo add support to throw errors on conflicting keywords
 * @todo add cleanup of baseSchema
 *       only possible for the first/direct level, as e.g. `allOf` was used to produce the `appliedSchema`,
 *       the `allOf` don't need to handled here and can be removed,
 *       it would only be needed in recursive `mergeSchema` usages,
 *       BUT all those are for keywords which should be already handled and be removed from the merged schema.
 *
 * Merge the applied schemas into a single branch for the current level.
 *
 * It implements specific strategies for various keywords to produce a predictable,
 * render-ready schema from a base schema and a list of applied sub-schemas.
 *
 * @param baseSchema The initial schema.
 * @param appliedSchemas A spread array of schemas to merge into the base schema.
 * @returns A new, merged schema.
 */
export function mergeSchemas(baseSchema: any, ...appliedSchemas: any[]): any {
    let mergedSchema: any = baseSchema instanceof Map ? baseSchema : OrderedMap(baseSchema)

    // remove stale allOf entries from baseSchema (first-level only)
    // as those would be already in `appliedSchema`
    // but especially as we fill `allOf` with new schemas, if there are conflicts
    // todo: should now the appliedSchema `allOf` be merged and not ignored? normally they should be flattened already to applied.
    if (mergedSchema.has('allOf')) {
        mergedSchema = mergedSchema.remove('allOf')
    }
    // todo: verify the `oneOf`/`anyOf` conflict resolving, as long as they overwrite and not combine directly, they should be save against duplications,
    //       check nested oneOf to validate behaviour, min. 3 levels deep; i expect "if oneOf comes from oneOf", that it leads to conflicts atm.

    let typeConflict = false

    for (const appliedSchema of appliedSchemas) {
        if (!appliedSchema || !isSomeSchema(appliedSchema)) continue

        let tmpSchema = mergedSchema

        appliedSchema.forEach((value, key) => {
            switch (key) {
                case 'required': {
                    const baseRequired = tmpSchema.get('required', List())
                    const appliedRequired = value as List<string>
                    tmpSchema = tmpSchema.set('required', baseRequired.toSet().union(appliedRequired.toSet()).toList())
                    break
                }

                case 'enum': {
                    const baseEnum = tmpSchema.get('enum') as List<any> | undefined
                    const appliedEnum = value as List<any>
                    if (baseEnum) {
                        const baseSet = baseEnum.toSet()
                        const appliedSet = appliedEnum.toSet()
                        tmpSchema = tmpSchema.set('enum', baseSet.intersect(appliedSet).toList())
                    } else {
                        tmpSchema = tmpSchema.set('enum', appliedEnum)
                    }
                    break
                }

                case 'type': {
                    if (typeConflict) {
                        break
                    }

                    const baseType = tmpSchema.get('type')
                    const appliedType = value
                    let baseTypes = Set(List.isList(baseType) ? baseType.toArray() : [baseType])
                    const appliedTypes = Set(List.isList(appliedType) ? appliedType.toArray() : [appliedType])

                    if (tmpSchema.has('type')) {
                        baseTypes = baseTypes.intersect(appliedTypes)
                    } else {
                        baseTypes = appliedTypes
                    }

                    if (baseTypes.size === 1) {
                        tmpSchema = tmpSchema.set('type', baseTypes.first())
                    } else if (baseTypes.size === 0) {
                        // Conflicting types result in an unsatisfiable schema,
                        // using an empty type array could serve as signal of conflict,
                        // but may provide unstable rendering,
                        // thus keeping the type which where collected until conflict.
                        // todo: decide on behaviour over time;
                        //       an alternative could be adding these types also via `allOf`, to keep them for UI context
                        // tmpSchema = tmpSchema.set('type', List())
                        typeConflict = true
                    } else {
                        tmpSchema = tmpSchema.set('type', baseTypes.toList())
                    }
                    break
                }

                // Numeric keywords (max value wins)
                case 'minLength':
                case 'minItems':
                case 'minimum':
                case 'exclusiveMinimum':
                    tmpSchema = tmpSchema.set(key, findMax(tmpSchema.get(key), value))
                    break

                // Numeric keywords (min value wins)
                case 'maxLength':
                case 'maxItems':
                case 'maximum':
                case 'exclusiveMaximum':
                    tmpSchema = tmpSchema.set(key, findMin(tmpSchema.get(key), value))
                    break

                case 'multipleOf': {
                    const baseMultipleOf = tmpSchema.get('multipleOf')
                    if (typeof baseMultipleOf === 'number' && typeof value === 'number') {
                        tmpSchema = tmpSchema.set('multipleOf', findLeastCommonMultiple(baseMultipleOf, value))
                    } else {
                        tmpSchema = tmpSchema.set('multipleOf', value)
                    }
                    break
                }

                case 'uniqueItems':
                    // If any is true, the result is true
                    tmpSchema = tmpSchema.set('uniqueItems', tmpSchema.get('uniqueItems', false) || value)
                    break

                case 'properties': {
                    const baseProperties = tmpSchema.get('properties', OrderedMap()) as OrderedMap<string, any>
                    const appliedProperties = value as OrderedMap<string, any>
                    let newProperties = baseProperties

                    appliedProperties.forEach((subSchema, propKey) => {
                        if (newProperties.has(propKey)) {
                            newProperties = newProperties.updateIn(
                                [propKey, 'allOf'],
                                // @ts-ignore
                                (allOf: List<any> = List()) => allOf.push(subSchema),
                            )
                        } else {
                            newProperties = newProperties.set(propKey, subSchema)
                        }
                    })
                    tmpSchema = tmpSchema.set('properties', newProperties)
                    break
                }

                case 'patternProperties': {
                    const basePatterns = tmpSchema.get('patternProperties', OrderedMap()) as OrderedMap<string, any>
                    const appliedPatterns = value as OrderedMap<string, any>
                    let newPatterns = basePatterns

                    appliedPatterns.forEach((subSchema, pattern) => {
                        if (newPatterns.has(pattern)) {
                            newPatterns = newPatterns.updateIn(
                                [pattern, 'allOf'],
                                // @ts-ignore
                                (allOf: List<any> = List()) => allOf.push(subSchema),
                            )
                        } else {
                            newPatterns = newPatterns.set(pattern, subSchema)
                        }
                    })
                    tmpSchema = tmpSchema.set('patternProperties', newPatterns)
                    break
                }

                case 'items':
                case 'prefixItems': {
                    const isTuple = List.isList(value) && value.every(isSomeSchema)
                    const base = tmpSchema.get(key)

                    if (isTuple && List.isList(base)) {
                        const merged = base.map((baseItem, idx) => {
                            const appliedItem = value.get(idx)
                            return appliedItem ? OrderedMap({allOf: List([baseItem, appliedItem])}) : baseItem
                        })
                        tmpSchema = tmpSchema.set(key, merged)
                    } else {
                        // fallback to single-schema items, wrapped in allOf
                        if (Map.isMap(value) && Map.isMap(base)) {
                            tmpSchema = tmpSchema.set(key, OrderedMap({
                                allOf: List([base, value]),
                            }))
                        } else {
                            // last-one-wins for incompatible types
                            tmpSchema = tmpSchema.set(key, value)
                        }
                    }
                    break
                }

                case 'additionalProperties':
                    // If any schema forbids additional properties, the result is `false`.
                    if (value === false) {
                        tmpSchema = tmpSchema.set('additionalProperties', false)
                    } else if (Map.isMap(value) && tmpSchema.get('additionalProperties') !== false) {
                        const baseAddProps = tmpSchema.get('additionalProperties')
                        if (Map.isMap(baseAddProps)) {
                            tmpSchema = tmpSchema.set('additionalProperties', OrderedMap({
                                allOf: List([baseAddProps, value]),
                            }))
                        } else {
                            tmpSchema = tmpSchema.set('additionalProperties', value)
                        }
                    } else if (!tmpSchema.has('additionalProperties')) {
                        tmpSchema = tmpSchema.set('additionalProperties', value)
                    }
                    break

                case 'const':
                    if (tmpSchema.has('const') && !is(tmpSchema.get('const'), value)) {
                        // todo: keep conflicts or remove? keeping it would only be useful for some other "get all const" util
                        tmpSchema = tmpSchema.update(
                            'allOf',
                            (allOf: List<any> = List()) => allOf.push(OrderedMap({const: value})),
                        )
                    } else {
                        tmpSchema = tmpSchema.set('const', value)
                    }
                    break

                // note: removing for the moment, as those have produced the `applied`;
                //       this is different from the other cleanup,
                //       as here the hoisted/other-branch applicators are removed,
                //       but not the keywords from the base schema itself.
                // case 'anyOf':
                // case 'oneOf':
                case 'allOf':
                case 'not':
                case 'if':
                case 'then':
                case 'else':
                case 'dependentSchemas':
                case '$defs':
                case 'definitions':
                    // tmpSchema = tmpSchema.mergeDeep({[key]: value})
                    break

                // except the applicator keywords which may be needed in options rendering,
                // but in a reliable strategy, which preserve where they come from,
                // but as `anyOf` is already validated, this is intended for usage by
                // e.g. select widgets to decide how to combine possible options
                case 'anyOf': {
                    const baseAnyOf = tmpSchema.get('anyOf', List())
                    const appliedAnyOf = key === 'anyOf' ? value : List()

                    if (appliedAnyOf.size > 0) {
                        if (baseAnyOf.size > 0) {
                            tmpSchema = tmpSchema.set('anyOf', List([
                                OrderedMap({anyOf: baseAnyOf}),
                                OrderedMap({anyOf: appliedAnyOf}),
                            ]))
                        } else {
                            tmpSchema = tmpSchema.set('anyOf', appliedAnyOf)
                        }
                    }
                    break
                }

                case 'oneOf': {
                    const baseOneOf = tmpSchema.get('oneOf', List())
                    const appliedOneOf = key === 'oneOf' ? value : List()

                    if (appliedOneOf.size > 0) {
                        if (baseOneOf.size > 0) {
                            tmpSchema = tmpSchema.set('oneOf', List([
                                OrderedMap({oneOf: baseOneOf}),
                                OrderedMap({oneOf: appliedOneOf}),
                            ]))
                        } else {
                            tmpSchema = tmpSchema.set('oneOf', appliedOneOf)
                        }
                    }
                    break
                }

                // $ref should be removed as its content is now part of the merged schema
                case '$ref':
                    // todo: make ref available after merging
                    // removing $ref for the moment, to prevent unstable merging and recursive resolving
                    break

                default:
                    // default case for any complex keyword: deep merge
                    if (tmpSchema.has(key) && Map.isMap(tmpSchema.get(key)) && Map.isMap(value)) {
                        tmpSchema = tmpSchema.set(key, tmpSchema.get(key).mergeDeep(value))
                    } else {
                        // default case for any scalar keyword or lists: last one wins
                        tmpSchema = tmpSchema.set(key, value)
                    }
                    break
            }
        })

        mergedSchema = tmpSchema
    }

    // todo: clean up those which are applied?
    //       would be easier is `applied` contains the path it was applied from
    //       - is always relative to the already merged schema in the standard setup
    //       - can be in a different branch with global validator
    // schema.delete('allOf')

    return mergedSchema
}

/**
 * @todo make as setup function, to support custom `mergeSchemas`
 */
export const validatorPlugin: SchemaPlugin<Omit<WidgetPluginProps, 'Next'> & { resource?: SchemaResource }> = {
    handle: (props) => {
        if (!props.validate) return {}
        const ownKey = props.storeKeys?.last()
        // todo: use `validate` from context - would require to add it to SchemaPlugin props interface
        const result = props.validate(
            props.schema,
            props.value,
            {
                instanceLocation: props.storeKeys?.toArray() || [],
                // note: the keywordLocation can't be reliable known at this position due to schema reduction for rendering
                keywordLocation: [],
                instanceKey: ownKey,
                parentSchema: props.parentSchema,
                resource: props.resource,
            },
        )
        const applicableSchema = mergeSchemas(props.schema, ...result.applied || [])
        if (result.valid) {
            return {
                valid: true,
                schema: applicableSchema,
            }
        }
        const errors = createOrdered(result.errors)
        return {
            valid: false,
            errors: errors,
            schema: applicableSchema,
        }
    },
}
