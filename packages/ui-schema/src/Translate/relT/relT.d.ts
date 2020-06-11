import { OrderedMap } from "immutable"
import { translation } from "@ui-schema/ui-schema/Translate/t"

export type relT = (
    schema: OrderedMap<{}, undefined>,
    context: Map<{}, undefined>,
    locale?: string
) => translation | undefined
