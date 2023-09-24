import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { List } from 'immutable'
import { StoreKeys } from '@ui-schema/system/ValueStore'

export interface NoWidgetProps {
    storeKeys: StoreKeys
    schemaKeys?: StoreKeys
    /**
     * @deprecated the new v0.5.0 matcher doesn't have defined scopes (type/custom)
     */
    scope?: string
    matching?: string
}

export interface GroupRendererProps {
    storeKeys: StoreKeys
    schemaKeys?: StoreKeys
    schema: UISchemaMap
    noGrid?: boolean
    style?: {}
    className?: string
    spacing?: number
}

export interface ErrorFallbackProps {
    error: any | null
    storeKeys: StoreKeys
    type?: string | List<string>
    widget?: string
}

// export interface WidgetsBindingComponents {
//     ErrorFallback?: React.ComponentType<ErrorFallbackProps>
//     // wraps any `object` that has no custom widget
//     GroupRenderer: React.ComponentType<GroupRendererProps>
//     // final widget matching and rendering
//     WidgetRenderer: React.ComponentType<WidgetRendererProps>
//     // if using `isVirtual` for no-output based rendering
//     VirtualRenderer: React.ComponentType<WidgetProps & WithValue>
//     // if no widget can be matched
//     NoWidget: React.ComponentType<NoWidgetProps>
//     // widget plugin system (react components)
//     widgetPlugins?: WidgetPluginType[]
//     // props plugin system (vanilla JS functions based)
//     schemaPlugins?: SchemaPlugin[]
//
//     // actual validator function to use outside of render flow (in functions)
//     // > added in `0.3.0`
//     // validator: () => void
// }

// /**
//  * widget binding
//  * - `C` = own `UIMetaContext` definition
//  * - `TW` = own type widgets definition
//  * - `CW` = own custom widgets definition
//  */
// export type WidgetsBindingFactory<W extends {} = {}, TW extends {} = {}, CW extends {} = {}> =
//     WidgetsBindingComponents & W &
//     WidgetsBindingRoot<TW, CW>

// todo: refactor binding to be better overridable but very strict for components
// export interface NextWidgetsDefinition {
//     components?: WidgetsBindingComponents
//     types?: any
//     custom?: any
//     widgetPlugins?: WidgetPluginType[]
//     schemaPlugins?: SchemaPlugin[]
//     // todo: or maybe from tactic:
//     processor?: (stage?: string) => any// as generic system-hook for `SchemaPlugins`/validator
//     renderMap?: any// as generic system-hook for `How-To-Render`
// }
