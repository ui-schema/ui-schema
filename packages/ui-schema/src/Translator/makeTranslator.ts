import { Map } from 'immutable'
import { getSchemaTranslationRelative } from '@ui-schema/ui-schema/TranslatorRelative'
import { translation, Translator, TranslatorDictionary } from '@ui-schema/ui-schema/Translator'

/**
 * Dictionary Factory
 *
 * pass in the dictionary that should be used, returns a new function that can work with it.
 *
 * - supports strings or functions as translation
 * - supports relative schema translation (keyword `t`)
 * - translation results should either be strings or React Components
 */
export const makeTranslator =
    <TTranslation extends translation = translation>(
        /**
         * The dictionary to use.
         */
        dictionary: TranslatorDictionary<TTranslation>,
        locale: string = '',
    ): Translator<TTranslation> =>
        (text, context = Map(), schema = undefined) => {
            const schemaT = getSchemaTranslationRelative(schema, context, locale)
            if (typeof schemaT !== 'undefined' && schemaT !== null) return schemaT

            if (typeof text !== 'string') return undefined

            const translation = dictionary.getIn(text.split('.'))

            if (typeof translation === 'function') {
                return translation(context, locale)
            }

            return translation
        }
