import * as React from 'react'

export interface WidgetCodeProviderProps {
    theme: string
}

export const WidgetCodeContext: React.Context<WidgetCodeProviderProps>

export const WidgetCodeProvider: (props: React.PropsWithChildren<WidgetCodeProviderProps>) => React.ReactElement

export function useWidgetCode(): WidgetCodeProviderProps
