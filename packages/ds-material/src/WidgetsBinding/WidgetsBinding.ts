import React from 'react'
import { ErrorFallbackProps, GroupRendererProps, NoWidgetProps, WidgetProps } from '@ui-schema/react/Widgets'
import { WithScalarValue } from '@ui-schema/react/UIStore'
import { CustomLeafsRenderMapping } from '@ui-schema/react/UIEngine'
import { InfoRendererProps } from '@ui-schema/ds-material/Component'
import { ReactLeafDefaultNodeType } from '@tactic-ui/react/LeafsEngine'

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type MuiWidgetsBinding<WE extends {} = {}, C extends {} = {}> = any

export type MuiComponentsBinding = {
    ErrorFallback?: React.ComponentType<ErrorFallbackProps>
    // wraps any `object` that has no custom widget
    GroupRenderer: React.ComponentType<React.PropsWithChildren<GroupRendererProps>>
    NoWidget?: React.ComponentType<NoWidgetProps>
    InfoRenderer?: React.ComponentType<InfoRendererProps>
}

export type NextMuiWidgetsBinding<W extends {}, M extends {}, C extends {}> = CustomLeafsRenderMapping<
    W &
    {
        // todo: make typing in tactic-ui compatible to use `React.FC/React.ComponentType` etc. instead of `ReactLeafDefaultNodeType`
        'type:string'?: ReactLeafDefaultNodeType<WidgetProps & M & WithScalarValue>
        'type:boolean'?: ReactLeafDefaultNodeType<WidgetProps & M & WithScalarValue>
        'type:number'?: ReactLeafDefaultNodeType<WidgetProps & M & WithScalarValue>
        'type:integer'?: ReactLeafDefaultNodeType<WidgetProps & M & WithScalarValue>
        'type:object'?: ReactLeafDefaultNodeType<WidgetProps & M>
    } &
    {
        [k: string]: React.ComponentType<WidgetProps & M> | React.ComponentType<WidgetProps & M & WithScalarValue>
    },
    C &
    MuiComponentsBinding
>
