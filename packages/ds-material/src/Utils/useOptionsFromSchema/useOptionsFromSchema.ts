import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { List, Map } from 'immutable'
import { beautifyKey, getTranslatableEnum, StoreKeys, tt } from '@ui-schema/ui-schema'

export interface OptionValueSchema<V = string | number> {
    value: V
    text: string
    fallback: string
    context: any
    schema: StoreSchemaType | undefined
}

export const useOptionsFromSchema = <V = string | number>(
    storeKeys: StoreKeys,
    schema: StoreSchemaType | undefined,
): {
    enumValues: List<V> | undefined
    valueSchemas: List<OptionValueSchema> | undefined
} => {
    let enumValues: List<V> | undefined
    let valueSchemas: List<OptionValueSchema> | undefined

    if (schema?.get('enum')) {
        enumValues = schema?.get('enum')
        valueSchemas = schema?.get('enum').map(enumVal => ({
            value: enumVal,
            schema: schema,
            text: storeKeys.insert(0, 'widget').concat(List(['enum', getTranslatableEnum(enumVal)])).join('.'),
            fallback: beautifyKey(getTranslatableEnum(enumVal), schema?.get('ttEnum') as tt) + '',
            context: Map({'relative': List(['enum', getTranslatableEnum(enumVal)])}),
        }))
    } else if (schema?.get('oneOf')) {
        const oneOfValues = schema?.get('oneOf')
        enumValues = oneOfValues.map(oneOf => oneOf.get('const'))
        valueSchemas = oneOfValues?.map(enumSchema => ({
            value: enumSchema.get('const'),
            schema: enumSchema,
            text: enumSchema.get('title') || enumSchema.get('const') as string | number,
            fallback: schema?.get('title') || beautifyKey(enumSchema.get('const') as string | number, enumSchema.get('tt') as tt),
            context: Map({'relative': List(['title'])}),
        }))
    }
    return {
        enumValues: enumValues,
        valueSchemas: valueSchemas,
    }
}
