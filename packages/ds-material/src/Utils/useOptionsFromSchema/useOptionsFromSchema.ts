import type { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import { StoreKeys } from '@ui-schema/ui-schema/ValueStore'
import { List, Map } from 'immutable'
import { getTranslatableEnum } from '@ui-schema/ui-schema/getTranslatableEnum'
import { beautifyKey, tt } from '@ui-schema/ui-schema/Utils/beautify'

export interface OptionValueSchema<V = string | number> {
    value: V
    text: string
    fallback: string
    context: any
    schema: SomeSchema | undefined
}

/**
 * Recursively traverses a schema to find all possible options,
 * defined by `const` keywords within `oneOf`, `anyOf` structures.
 */
const flattenSchemaOptions = (
    schema: SomeSchema,
    tt?: tt,
): List<OptionValueSchema> => {
    // todo: validate this behaviour, as applied-schema merging hoists the applied options `const`!
    //       is cleaned up for initial schema level, but not for nested
    // stop collecting once a `const` was found
    if (schema.has('const')) {
        const constVal = schema.get('const')
        return List<OptionValueSchema>([{
            value: constVal,
            schema: schema,
            // @ts-ignore
            text: schema.get('title') || getTranslatableEnum(constVal),
            fallback: schema.get('title') || beautifyKey(getTranslatableEnum(constVal), schema.get('tt') as tt ?? tt),
            context: Map({'relative': List(['title'])}),
        }])
    }

    let collectedOptions = List<OptionValueSchema>()

    const oneOf = schema.get('oneOf') as List<SomeSchema> | undefined
    if (List.isList(oneOf)) {
        const oneOfOptions = oneOf.flatMap(subSchema =>
            flattenSchemaOptions(subSchema, schema.get('ttEnum') as tt ?? tt),
        )
        collectedOptions = collectedOptions.concat(oneOfOptions)
    }

    const anyOf = schema.get('anyOf') as List<SomeSchema> | undefined
    if (List.isList(anyOf)) {
        const anyOfOptions = anyOf.flatMap(subSchema =>
            flattenSchemaOptions(subSchema, schema.get('ttEnum') as tt ?? tt),
        )
        collectedOptions = collectedOptions.concat(anyOfOptions)
        // todo: for anyOf, also find options with only `type` keyword, to infer if free-form options are possible.
        //       (or for all combination subschema?)
        //       make as util to also check for other validation keywords like min/max ranges, etc.?
    }

    // todo: would be already done via validator applied, which should hoist the respective `allOf`/`anyOf`;
    //       but what about `allOf` in `oneOf`?
    // // `allOf` is a conjunction (AND), combining multiple schemas.
    // // We must merge all sub-schemas into one before trying to find options.
    // const allOf = schema.get('allOf') as List<SomeSchema> | undefined
    // if (List.isList(allOf)) {
    //     // Start with the base schema (without `allOf` itself)
    //     let mergedSchema = schema.delete('allOf')
    //     // And merge each of the sub-schemas from the `allOf` list.
    //     allOf.forEach(subSchema => {
    //         mergedSchema = mergedSchema.mergeDeep(subSchema)
    //     })
    //     // Now recurse with the fully merged schema.
    //     const allOfOptions = _flattenSchemaOptions(mergedSchema)
    //     collectedOptions = collectedOptions.concat(allOfOptions)
    // }

    return collectedOptions
}

/**
 * A basic options collection helper.
 * @todo optimize for new applied schemas, this combines all `oneOf`, instead of intersecting them.
 */
export const getOptionsFromSchema = <V = string | number>(
    storeKeys: StoreKeys,
    schema: SomeSchema | undefined,
): {
    enumValues: List<V> | undefined
    valueSchemas: List<OptionValueSchema<V>> | undefined
} => {
    if (!schema) {
        return {enumValues: undefined, valueSchemas: undefined}
    }

    const ttEnum = schema.get('ttEnum') as tt

    if (schema.has('enum')) {
        const enumValues = schema.get('enum') as List<V>
        const valueSchemas = enumValues.map(enumVal => ({
            value: enumVal,
            schema: schema,
            // @ts-ignore
            text: storeKeys.insert(0, 'widget').concat(List(['enum', getTranslatableEnum(enumVal)])).join('.'),
            // @ts-ignore
            fallback: beautifyKey(getTranslatableEnum(enumVal), ttEnum) + '',
            // @ts-ignore
            context: Map({'relative': List(['enum', getTranslatableEnum(enumVal)])}),
        }))

        return {
            enumValues,
            valueSchemas: valueSchemas as List<OptionValueSchema<V>>,
        }
    }

    const schemasFromApplicators = flattenSchemaOptions(
        // removing a potentially hoisted `const`, for root level
        schema.delete('const'),
        ttEnum,
    )

    if (schemasFromApplicators.size > 0) {
        // Deduplicate options based on their `value`. In case of duplicates, the first one wins.
        const uniqueValueSchemas = schemasFromApplicators
            .groupBy(o => o.value)
            .map(group => group.first(undefined) as OptionValueSchema<V>)
            .toList()
        // .sortBy(o => String(o.value))

        const enumValues = uniqueValueSchemas.map(vs => vs.value)

        return {
            enumValues: enumValues,
            valueSchemas: uniqueValueSchemas,
        }
    }

    return {
        enumValues: undefined,
        valueSchemas: undefined,
    }
}

export const useOptionsFromSchema = <V = string | number>(
    storeKeys: StoreKeys,
    schema: SomeSchema | undefined,
): {
    enumValues: List<V> | undefined
    valueSchemas: List<OptionValueSchema<V>> | undefined
} => {
    return getOptionsFromSchema<V>(storeKeys, schema)
}
