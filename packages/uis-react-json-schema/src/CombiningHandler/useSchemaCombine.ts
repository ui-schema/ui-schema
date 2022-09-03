import React from 'react'
import { List, Map, OrderedMap } from 'immutable'
import { handleIfElseThen } from '@ui-schema/react-json-schema/ConditionalHandler'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { mergeSchema } from '@ui-schema/system/Utils/mergeSchema'

export const handleSchemaCombine = (schema: UISchemaMap, value: Map<string | number, any> | OrderedMap<string | number, any>): UISchemaMap => {
    const allOf = schema.get('allOf') as List<UISchemaMap>
    if(allOf) {
        allOf.forEach((subSchema) => {
            // removing afterwards-handled keywords, otherwise they would merge wrongly/double evaluate
            schema = mergeSchema(schema, subSchema.delete('if').delete('else').delete('then').delete('allOf'))
            schema = handleIfElseThen(subSchema, value, schema)

            const allOf1 = subSchema.get('allOf') as List<UISchemaMap>
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

export const useSchemaCombine = (schema: UISchemaMap, value: Map<string | number, any> | OrderedMap<string | number, any>) => {
    return React.useMemo(() => handleSchemaCombine(schema, value), [schema, value])
}
