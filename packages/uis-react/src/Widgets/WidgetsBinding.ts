import React from 'react'
import { WidgetPluginType } from '@ui-schema/react/WidgetEngine'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { StoreKeys, WithValue } from '@ui-schema/react/UIStore'
import { List } from 'immutable'
import { WidgetsBindingRoot } from '@ui-schema/system/WidgetsBinding'

export interface NoWidgetProps {
    storeKeys: StoreKeys
    scope?: string
    matching?: string
}

export interface GroupRendererProps {
    storeKeys: StoreKeys
    schema: UISchemaMap
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
    GroupRenderer: React.ComponentType<GroupRendererProps>
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

/**
 * widget binding
 * - `C` = own `UIMetaContext` definition
 * - `TW` = own type widgets definition
 * - `CW` = own custom widgets definition
 */
export type WidgetsBindingFactory<W extends {} = {}, TW extends {} = {}, CW extends {} = {}> =
    WidgetsBindingComponents & W &
    WidgetsBindingRoot<TW, CW>
