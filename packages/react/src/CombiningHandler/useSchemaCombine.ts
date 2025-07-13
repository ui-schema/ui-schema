/* eslint-disable @typescript-eslint/no-deprecated */
import { ValidateFn } from '@ui-schema/ui-schema/Validate'
import { useMemo } from 'react'
import { List, Map, OrderedMap } from 'immutable'
import { handleIfElseThen } from '@ui-schema/react/ConditionalHandler'
import type { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import { mergeSchema } from '@ui-schema/ui-schema/Utils/mergeSchema'

/**
 * @deprecated use new validatorPlugin instead
 */
export const handleSchemaCombine = (
    validate: ValidateFn,
    schema: SomeSchema,
    value: Map<unknown, unknown> | OrderedMap<unknown, unknown>,
): SomeSchema => {
    const allOf = schema.get('allOf') as List<SomeSchema>
    if (allOf) {
        allOf.forEach((subSchema) => {
            // removing afterwards-handled keywords, otherwise they would merge wrongly/double evaluate
            schema = mergeSchema(schema, subSchema.delete('if').delete('else').delete('then').delete('allOf'))
            schema = handleIfElseThen(subSchema, value, schema, {validate: validate})

            const allOf1 = subSchema.get('allOf') as List<SomeSchema>
            if (allOf1) {
                // nested allOf may appear when using complex combining-conditional schemas
                allOf1.forEach((subSchema1) => {
                    // removing afterwards-handled keywords, otherwise they would merge wrongly/double evaluate
                    // further on nested `allOf` will be resolved by render flow
                    schema = mergeSchema(schema, subSchema1.delete('if').delete('else').delete('then'))
                    schema = handleIfElseThen(subSchema1, value, schema, {validate: validate})
                })
            }
        })
    }
    return schema
}

/**
 * @deprecated use new validatorPlugin instead
 */
export const useSchemaCombine = (
    validate: ValidateFn | undefined,
    schema: SomeSchema,
    value: unknown,
) => {
    return useMemo(
        () => validate && (Map.isMap(value) || OrderedMap.isOrderedMap(value)) ? handleSchemaCombine(validate, schema, value) : schema,
        [validate, schema, value],
    )
}
