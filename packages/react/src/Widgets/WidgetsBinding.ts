import { SchemaKeywordType, SchemaTypesType, SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import { WidgetPayload } from '@ui-schema/ui-schema/Widget'
import type { ComponentType, ReactNode } from 'react'
import { WidgetPluginType } from '@ui-schema/react/WidgetEngine'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { StoreKeys, WithValuePlain } from '@ui-schema/react/UIStore'
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
    children: ReactNode
}

export interface ErrorFallbackProps {
    error: any | null
    storeKeys: StoreKeys
    type?: string | List<string>
    widget?: string
}

export interface WidgetsBindingComponents {
    /**
     * Wrapped around each schema layer, used to catch errors during rendering.
     */
    ErrorFallback?: ComponentType<ErrorFallbackProps>
    /**
     * Wraps any `object` that has no custom widget.
     */
    GroupRenderer?: ComponentType<GroupRendererProps>
    /**
     * When used with `isVirtual` in `WidgetEngine`, this component is used to render virtual widgets.
     */
    VirtualRenderer?: ComponentType<WidgetProps & WithValuePlain>
    /**
     * When `matchWidget` cannot find a widget and throws an `ErrorNoWidgetMatching`, this component is used.
     */
    NoWidget?: ComponentType<NoWidgetProps>
    /**
     * Widget plugins, used by `WidgetEngine` to render a schema layer.
     */
    widgetPlugins?: WidgetPluginType[]
}

export interface MatchProps<WP extends WidgetPayload = WidgetPayload> {
    widgetName: string | undefined
    schemaType: SchemaTypesType

    widgets?: {
        types?: { [K in SchemaKeywordType]?: (props: WP) => ReactNode }
        custom?: Record<string, (props: WP) => ReactNode>
    }
}

/**
 * widget binding
 * - `C` = own `UIMetaContext` definition
 * - `TW` = own type widgets definition
 * - `CW` = own custom widgets definition
 * @todo make stricter and add support for strict checks in UIMetaProvider with inferring,
 *       and normalize with all other matchWidget/widgets types, atm. testing MUI with strict shared interface
 */
export type WidgetsBindingFactory<TW extends {} = {}, CW extends {} = {}> =
    WidgetsBindingComponents &
    {
        widgets?: WidgetsBindingRoot<TW, CW>
    } &
    {
        matchWidget?: (props: MatchProps<any>) => null | ((props: any) => ReactNode)
    }
