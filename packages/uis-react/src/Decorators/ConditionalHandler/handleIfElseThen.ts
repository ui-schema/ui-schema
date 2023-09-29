import { validateSchema } from '@ui-schema/system/validateSchema'
import { mergeSchema } from '@ui-schema/system/Utils/mergeSchema'
import { UISchemaMap } from '@ui-schema/system/Definitions'

/**
 * Handles schema if else then and returns the new merged schema which contains the merged value of `if` and `then`
 */
export const handleIfElseThen = (
    // the schema which contains the if / else / then part
    schema: UISchemaMap,
    // the value against which the `distSchema` is validated
    value: any,
    // the schema which must be valid for having `then` applied
    distSchema: UISchemaMap,
): UISchemaMap => {
    const keyIf = schema.get('if')
    const keyThen = schema.get('then')
    const keyElse = schema.get('else')
    if (keyIf) {
        if (0 === validateSchema(keyIf, value, true).errCount) {
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
