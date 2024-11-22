import { Map } from 'immutable'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { translation, Translator, TranslatorContext } from '@ui-schema/system/Translator'

export const TranslatorRelative = (
    schema?: UISchemaMap,
    context?: TranslatorContext,
    locale?: string,
): translation | undefined => {
    if (Map.isMap(schema) && context && context.get('relative')) {
        const relSchema = locale ? schema.get(locale) : schema
        if (Map.isMap(relSchema)) {
            const schemaT = relSchema.getIn(context.get('relative'))
            if (schemaT) return schemaT as translation
        }
    }

    return undefined
}

export const translateRelative: Translator = (_text, context, schema = undefined) =>
    TranslatorRelative(schema, context)
