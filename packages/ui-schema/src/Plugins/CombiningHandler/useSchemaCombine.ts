import { handleIfElseThen } from '@ui-schema/ui-schema/Plugins/ConditionalHandler'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { mergeSchema } from '@ui-schema/ui-schema/Utils/mergeSchema'
import { List, Map, OrderedMap } from 'immutable'
import React from 'react'

export const handleSchemaCombine = (schema: StoreSchemaType, value: Map<string | number, any> | OrderedMap<string | number, any>): StoreSchemaType => {
    const allOf = schema.get('allOf') as List<StoreSchemaType>
    if(allOf) {
        allOf.forEach((subSchema) => {
            // removing afterwards-handled keywords, otherwise they would merge wrongly/double evaluate
            schema = mergeSchema(schema, subSchema.delete('if').delete('else').delete('then').delete('allOf'))
            schema = handleIfElseThen(subSchema, value, schema)

            const allOf1 = subSchema.get('allOf') as List<StoreSchemaType>
            if(allOf1) {
                // nested allOf may appear when using complex combining-conditional schemas
                allOf1.forEach((subSchema1) => {
                    // removing afterwards-handled keywords, otherwise they would merge wrongly/double evaluate
                    // further on nested `allOf` will be resolved by render flow
                    schema = mergeSchema(schema, subSchema1.delete('if').delete('else').delete('then'))
                    schema = handleIfElseThen(subSchema1, value, schema)
                })
            }
        })
    }
    return schema
}

export const useSchemaCombine = (schema: StoreSchemaType, value: Map<string | number, any> | OrderedMap<string | number, any>) => {
    return React.useMemo(() => handleSchemaCombine(schema, value), [schema, value])
}
