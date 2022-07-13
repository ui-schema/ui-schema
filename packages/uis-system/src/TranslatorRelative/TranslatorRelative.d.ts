import { translation, Translator, TranslatorContext } from '@ui-schema/system/Translator'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

/**
 * for handling relative schema translation
 * @param schema
 * @param context
 * @param locale
 */
export function TranslatorRelative(
    schema?: UISchemaMap,
    context?: TranslatorContext,
    locale?: string
): translation | undefined

/**
 * as translator, using `TranslatorRelative` internally
 */
export const translateRelative: Translator
