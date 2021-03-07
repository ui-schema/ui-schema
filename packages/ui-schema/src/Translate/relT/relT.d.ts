import { translation, TranslatorContext } from '@ui-schema/ui-schema/Translate/t'
import { StoreSchemaType } from "@ui-schema/ui-schema/CommonTypings"

export function relT(
    schema?: StoreSchemaType,
    context?: TranslatorContext,
    locale?: string
): translation | undefined
