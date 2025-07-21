import type { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import type { SchemaKeywordType, SchemaTypesType, SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import type { WidgetMatch } from '@ui-schema/ui-schema/matchWidget'
import type { StoreKeys } from '@ui-schema/ui-schema/ValueStore'
import type { WidgetPayload } from '@ui-schema/ui-schema/Widget'
import type { ComponentType, FunctionComponent, ReactNode, Component } from 'react'
import type { WidgetPluginProps, WidgetPluginType } from '@ui-schema/react/WidgetEngine'
import type { WithOnChange, WithValuePlain } from '@ui-schema/react/UIStore'
import type { UIMetaContextBase } from '@ui-schema/react/UIMeta'
import type { List } from 'immutable'
import type { WidgetsBindingRoot } from '@ui-schema/ui-schema/WidgetsBinding'
import type { WidgetProps } from './Widget.js'

/**
 * note: we can't use ComponentType here, as it leads to problems with FC vs. others and
 *      throwing errors if a component has optional props, which are defined are required in the binding,
 *      which is of course ok, as a widget can always rely on less, just not more (required) as defined in the shared interface
 *
 * @experimental mv into central react and use for any component type?
 * @todo setup CI test to check against lowest possible react version, so that error doesn't occur,
 *       even if dev setup react is "fixed" (react19 has propTypes any)
 * @todo care about `ClassComponent` at all or enforce `.FC` usage?
 */
type MinimalClassComponent<P> = {
    new(
        props: P,
    ): Component<any, any, any>

    displayName?: string
}

export type MinimalComponentType<P> =
    {
        // using this for react18/19 compat, as feature detection on async components
        (props: P): ReturnType<FunctionComponent>
        displayName?: string
    } |
    MinimalClassComponent<P>

type WidgetsBinding<A = UIStoreActions, B = {}, WP extends WidgetProps<B, A> = WidgetProps<B, A>> =
    { [K in SchemaKeywordType]?: MinimalComponentType<WP> } &
    Record<string, MinimalComponentType<WP>>

export interface NoWidgetProps {
    storeKeys: StoreKeys
    scope?: string
    widgetId?: string
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

export interface BindingComponents {
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
    VirtualRenderer?: ComponentType<WidgetPayload & UIMetaContextBase & WithOnChange & WithValuePlain>
    /**
     * When `matchWidget` cannot find a widget and throws an `ErrorNoWidgetMatching`, this component is used.
     */
    NoWidget?: ComponentType<NoWidgetProps>
    /**
     * Widget plugins, used by `WidgetEngine` to render a schema layer.
     */
    widgetPlugins?: WidgetPluginType[]
}

export interface WidgetMatchProps<WP extends WidgetPayload = WidgetPayload> {
    widgetName: string | undefined
    schemaType: SchemaTypesType

    widgets?: Record<string, MinimalComponentType<WP>>
}

/**
 * widget binding
 * - `C` = own `UIMetaContext` definition
 * - `TW` = own type widgets definition
 * - `CW` = own custom widgets definition
 * @todo support OnChange generics
 * @todo typing `PWidgetPlugins` strict here leads again to the problem with circular types, but why isn't that the cause with `widgetPlugins`?
 *       switched to `any` here, as the stricter typing comes from mui bindingType and WidgetRenderer atm.,
 *       and here it must be as loose as possible to infer it correctly, while there is must be infer all at once.
 */
export type BindingTypeGeneric<TW extends {} = {}> =
    Omit<BindingComponents, 'widgetPlugins'> &
    {
        widgetPlugins?: MinimalComponentType<any>[]

        /**
         * The component which is rendered inside the WidgetEngine, after any widgetPlugin is applied.
         */
        WidgetRenderer?: MinimalComponentType<any>

        widgets?: WidgetsBindingRoot<TW>

        matchWidget?: (props: WidgetMatchProps<any>) => null | WidgetMatch<MinimalComponentType<any>>
    }

export type BindingType<A = UIStoreActions, B = {}, WP extends WidgetProps<B, A> = WidgetProps<B, A>> =
    Omit<BindingComponents, 'widgetPlugins'> &
    BindingTypeWidgets<A, WP>

export type BindingTypeWidgets<A = UIStoreActions, B = {}, WP extends WidgetProps<B, A> = WidgetProps<B, A>> =
    {
        widgetPlugins?: MinimalComponentType<WP & Omit<WidgetPluginProps<B, A>, keyof WP>>[]
    } &
    {
        /**
         * The component which is rendered inside the WidgetEngine, after any widgetPlugin is applied.
         */
        WidgetRenderer?: MinimalComponentType<WP & Omit<WidgetPluginProps<B, A>, keyof WP>>
    } &
    {
        widgets?: WidgetsBinding<A, B, WP>
    } &
    {
        matchWidget?: (props: WidgetMatchProps<WP>) => null | WidgetMatch<MinimalComponentType<WP>>
    }
