import React from "react"
import { Map, OrderedMap } from "immutable"

export type translation = string | number | undefined | Function | React.Component

export type translator = (
    text: string,
    context?: Map<{}, undefined>,
    schema?: OrderedMap<{}, undefined>
) => translation

export type t = (
    dictionary: Map<{}, undefined>,
    locale: string
) => translator
