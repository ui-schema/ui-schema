import { Map } from 'immutable'
import { UISchemaMap } from '@ui-schema/system/Definitions'
import { translation, Translator, TranslatorContext } from '@ui-schema/system/Translator'

export const TranslatorRelative = (
    schema?: UISchemaMap,
    context?: TranslatorContext,
    locale?: string,
): translation | undefined => {
    if (Map.isMap(schema) && context && context.get('relative')) {
        const relSchema = locale ? schema.get(locale) : schema
        if (relSchema) {
            const schemaT = relSchema.getIn(context.get('relative'))
            if (schemaT) return schemaT
        }
    }

    return undefined
}

export const translateRelative: Translator = (_text, context, schema = undefined) =>
    TranslatorRelative(schema, context)
