import * as React from 'react'

export interface WidgetCodeContextType {
    // e.g. import theme:
    // import 'codemirror/theme/duotone-dark.css'
    // set theme prop to: `duotone-dark`
    theme?: string
    // mode mapping, where the `mode` key is accessed with `schema.format`,
    // when not set, uses format directly
    // e.g. needed for JSON, not needed for CSS
    modes?: {
        [mode: string]: {
            name: string
            [k: string]: any
        }
    }
}

/**
 * @deprecated will be removed with major `0.3.0` release, more concise naming
 */
export type  WidgetCodeProviderProps = WidgetCodeContextType

export const WidgetCodeContext: React.Context<WidgetCodeContextType>

export const WidgetCodeProvider: React.ComponentType<React.PropsWithChildren<WidgetCodeContextType>>

export function useWidgetCode(): WidgetCodeContextType
