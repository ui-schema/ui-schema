import { mergeSchema } from '@ui-schema/ui-schema/Utils/mergeSchema'
import type { ValidateStateNested } from '@ui-schema/ui-schema/Validate'
import type { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'

/**
 * Handles schema if else then and returns the new merged schema which contains the merged value of `if` and `then`
 * @deprecated included in validators
 */
export const handleIfElseThen = (
    // the schema which contains the if / else / then part
    schema: SomeSchema,
    // the value against which the `distSchema` is validated
    value: unknown,
    // the schema which must be valid for having `then` applied
    distSchema: SomeSchema,
    state: ValidateStateNested,
): SomeSchema => {
    const keyIf = schema.get('if')
    const keyThen = schema.get('then')
    const keyElse = schema.get('else')
    if (keyIf) {
        const result = state.validate(
            keyIf,
            value,
            {
                instanceLocation: [],
                keywordLocation: [],
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
