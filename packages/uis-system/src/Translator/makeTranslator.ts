import { Map } from 'immutable'
import { TranslatorRelative } from '@ui-schema/system/TranslatorRelative'
import { translation, Translator, TranslatorDictionary } from '@ui-schema/system/Translator'

/**
 * Dictionary Factory
 * pass in the dictionary that should be used, returns a new function that can work with it.
 * - supports strings or functions as translation
 * - supports relative schema translation (keyword `t`)
 * - translation results should either be strings or React Components
 */
export const makeTranslator =
    <TTranslation extends translation = translation>(
        dictionary: TranslatorDictionary<TTranslation>,
        locale: string = '',
    ): Translator<TTranslation> =>
        (text, context = Map(), schema = undefined) => {
            const schemaT = TranslatorRelative(schema, context, locale)
            if (schemaT) return schemaT

            if (typeof text !== 'string') return undefined

            const trans = dictionary.getIn(text.split('.'))

            if (typeof trans === 'function') {
                return trans(context, locale)
            }

            return trans
        }
