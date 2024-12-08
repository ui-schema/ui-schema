import { makeParams, ValidatorStateNested } from '@ui-schema/json-schema/Validator'
import { mergeSchema } from '@ui-schema/system/Utils/mergeSchema'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

/**
 * Handles schema if else then and returns the new merged schema which contains the merged value of `if` and `then`
 */
export const handleIfElseThen = (
    // the schema which contains the if / else / then part
    schema: UISchemaMap,
    // the value against which the `distSchema` is validated
    value: unknown,
    // the schema which must be valid for having `then` applied
    distSchema: UISchemaMap,
    state: ValidatorStateNested,
): UISchemaMap => {
    const keyIf = schema.get('if')
    const keyThen = schema.get('then')
    const keyElse = schema.get('else')
    if (keyIf) {
        const result = state.validate(
            keyIf,
            value,
            {
                ...makeParams(),
                recursive: true,
                resource: state.resource,
            },
        )
        if (result.valid) {
            // no errors in schema found, `then` should be rendered
            if (keyThen) {
                distSchema = mergeSchema(distSchema, keyThen)
            }
        } else {
            // errors in schema found, `else` should be rendered
            if (keyElse) {
                distSchema = mergeSchema(distSchema, keyElse)
            }
        }
    }

    return distSchema
}
