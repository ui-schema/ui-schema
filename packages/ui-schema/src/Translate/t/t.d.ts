import React from "react"
import { Map, OrderedMap } from "immutable"

export type translation = string | number | undefined | Function | React.ComponentType

export type Translator = (
    text: string,
    context?: Map<{}, undefined>,
    schema?: OrderedMap<{}, undefined>
) => translation

export const t: (
    dictionary: Map<{}, undefined>,
    locale: string
) => Translator
