import { translation } from "@ui-schema/ui-schema/Translate/t"
import { Map } from 'immutable/dist/immutable-nonambient'
import { StoreSchemaType } from "@ui-schema/ui-schema/CommonTypings"

export function relT(
    schema: StoreSchemaType,
    context: Map<{}, undefined>,
    locale?: string
): translation | undefined
