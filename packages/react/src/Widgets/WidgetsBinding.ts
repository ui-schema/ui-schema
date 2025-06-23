import { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import { SchemaKeywordType, SchemaTypesType, SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import React, { ReactNode } from 'react'
import { WidgetPluginType } from '@ui-schema/react/WidgetEngine'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { StoreKeys, WithOnChange, WithValue, WithValuePlain } from '@ui-schema/react/UIStore'
import { List } from 'immutable'
import { WidgetsBindingRoot } from '@ui-schema/ui-schema/WidgetsBinding'

export interface NoWidgetProps {
    storeKeys: StoreKeys
    scope?: string
    matching?: string
}

export interface GroupRendererProps {
    storeKeys: StoreKeys
    schema: SomeSchema
    noGrid?: boolean
    style?: {}
    className?: string
    spacing?: number
    children: React.ReactNode
}

export interface ErrorFallbackProps {
    error: any | null
    storeKeys: StoreKeys
    type?: string | List<string>
    widget?: string
}

export interface WidgetsBindingComponents {
    ErrorFallback?: React.ComponentType<ErrorFallbackProps>
    // wraps any `object` that has no custom widget
    GroupRenderer?: React.ComponentType<GroupRendererProps>
    // if using `isVirtual` for no-output based rendering
    VirtualRenderer?: React.ComponentType<WidgetProps & WithValue>
    // if no widget can be matched
    NoWidget?: React.ComponentType<NoWidgetProps>
    // widget plugin system (react components)
    widgetPlugins?: WidgetPluginType[]

    // actual validator function to use outside of render flow (in functions)
    // > added in `0.3.0`
    // validator: () => void
}

export interface MatchProps<A = UIStoreActions, WP extends WidgetPropsComplete<A> = WidgetPropsComplete<A>> {
    widgetName: string | undefined
    schemaType: SchemaTypesType
    isVirtual?: boolean

    widgets?: {
        types?: { [K in SchemaKeywordType]?: (props: WP) => ReactNode }
        custom?: Record<string, (props: WP) => ReactNode>
    }
}

// todo: clean up
export type WidgetPropsComplete<A = UIStoreActions> = WidgetProps & WithOnChange<A> & WithValuePlain

// todo: move into UISchema as a generic-generic factory typing?! this shit again...
//       - TMatchProps depends on what the WidgetRenderer plugin supports
// todo: why not move as arg. of WidgetRenderer?
// export type WidgetMatcher<TWidget, TMatchProps extends MatchProps = MatchProps> =
//     (matchProps: TMatchProps) => TWidget

/**
 * widget binding
 * - `C` = own `UIMetaContext` definition
 * - `TW` = own type widgets definition
 * - `CW` = own custom widgets definition
 * @todo make stricter and add support for strict checks in UIMetaProvider with inferring,
         and normalize with all other matchWidget/widgets types, atm. testing MUI with strict shared interface
 */
export type WidgetsBindingFactory<TW extends {} = {}, CW extends {} = {}> =
    WidgetsBindingComponents &
    {
        widgets?: WidgetsBindingRoot<TW, CW>
    } &
    {
        matchWidget?: (props: MatchProps<any, any>) => null | ((props: any) => ReactNode)
    }
