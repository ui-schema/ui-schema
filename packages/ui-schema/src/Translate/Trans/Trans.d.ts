import React from "react"
import { OrderedMap } from "immutable"
import { translation } from "../t"

export interface TransProps {
    text: string
    context?: Map<{}, undefined>
    schema?: OrderedMap<{}, undefined>
    fallback?: translation
}

/**
 * Translation component, supports dot strings, dictionary can be mixed strings, string functions and function components as translation
 */
export function Trans<P extends TransProps>(props: P): React.Component<P>
