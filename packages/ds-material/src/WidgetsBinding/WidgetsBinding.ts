import React from 'react'
import { ErrorFallbackProps, GroupRendererProps, NoWidgetProps, WidgetProps } from '@ui-schema/react/Widgets'
import { WithScalarValue } from '@ui-schema/react/UIStore'
import { LeafsRenderMapping, ReactLeafsNodeSpec } from '@tactic-ui/react/LeafsEngine'
import { InfoRendererProps } from '@ui-schema/ds-material/Component'
import { ReactLeafDefaultNodeType } from '@tactic-ui/react/LeafsEngine'
import { SchemaValidatorContext } from '@ui-schema/system/SchemaPluginStack'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type MuiWidgetsBinding<WE extends {} = {}, C extends {} = {}> = any

export type MuiComponentsBinding = {
    ErrorFallback?: ReactLeafDefaultNodeType<ErrorFallbackProps>
    // wraps any `object` that has no custom widget
    GroupRenderer: ReactLeafDefaultNodeType<React.PropsWithChildren<GroupRendererProps>>
    NoWidget?: ReactLeafDefaultNodeType<NoWidgetProps>
    InfoRenderer?: ReactLeafDefaultNodeType<InfoRendererProps>
}

export type NextMuiWidgetsBinding<W extends {}, M extends {}, C extends {}> =
    LeafsRenderMapping<
        // widgets / leafs
        ReactLeafsNodeSpec<
            {
                'type:string'?: WidgetProps & SchemaValidatorContext & M & WithScalarValue
                'type:boolean'?: WidgetProps & SchemaValidatorContext & M & WithScalarValue
                'type:number'?: WidgetProps & SchemaValidatorContext & M & WithScalarValue
                'type:integer'?: WidgetProps & SchemaValidatorContext & M & WithScalarValue
                'type:object'?: WidgetProps & SchemaValidatorContext & M
            } &
            // note: allowing extending here won't work
            // ({
            //     [k: string]: (WidgetProps & M)
            // } | {
            //     [k: string]: (WidgetProps & M & WithScalarValue)
            // }) &
            W
        > &
        // allowing extending dynamically, todo: maybe mv as extra typing, as now consuming code can't make it fully strict
        { [k: string]: ReactLeafDefaultNodeType<WidgetProps & SchemaValidatorContext & M> | ReactLeafDefaultNodeType<WidgetProps & SchemaValidatorContext & M & WithScalarValue> },
        // static components
        MuiComponentsBinding &
        C,
        { schema?: UISchemaMap }
    >
