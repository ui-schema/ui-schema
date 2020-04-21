import { OrderedMap } from "immutable"
import { translation } from "./t"

export type relT = (
    schema: OrderedMap<{}, undefined>,
    context: Map<{}, undefined>,
    locale?: string
) => translation | undefined
