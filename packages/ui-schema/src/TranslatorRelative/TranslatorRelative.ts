import { Map } from 'immutable'
import { translation, Translator, TranslatorContext } from '@ui-schema/ui-schema/Translator'

export const getSchemaTranslationRelative = (
    schema?: Map<unknown, unknown>,
    context?: TranslatorContext,
    locale?: string,
): translation | undefined => {
    if (Map.isMap(schema) && context && context.get('relative')) {
        const relSchema = locale ? schema.get(locale) : schema
        if (Map.isMap(relSchema)) {
            const schemaT = relSchema.getIn(context.get('relative'))
            if (typeof schemaT !== 'undefined' && schemaT !== null) return schemaT as translation
        }
    }

    return undefined
}

export const translatorRelative: Translator = (_text, context, schema = undefined) =>
    getSchemaTranslationRelative(schema, context)
