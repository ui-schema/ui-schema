import type { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import type { SchemaKeywordType } from '@ui-schema/ui-schema/CommonTypings'
import type { WidgetsBindingRoot } from '@ui-schema/ui-schema/WidgetsBinding'
import { ComponentType, ReactNode } from 'react'
import type { MatchProps, WidgetProps, WidgetsBindingComponents } from '@ui-schema/react/Widgets'
import type { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import type { InfoRendererProps } from '@ui-schema/ds-material/Component'

export type MuiWidgetsBindingTypes<A = UIStoreActions, WP extends WidgetProps<{}, A> = WidgetProps<{}, A>> = {
    [K in SchemaKeywordType]?: (props: WP) => ReactNode
}

/**
 * note: we can't use ComponentType here, as it leads to problems with FC vs. others and
 *      throwing errors if a component has optional props, which are defined are required in the binding,
 *      which is of course ok, as a widget can always rely on less, just not more (required) as defined in the shared interface
 *
 * @experimental mv into central react and use for any component type?
 */
type MinimalClassComponent<P> = {
    new(
        props: P,
    ): {
        render(): ReactNode
    }

    displayName?: string
}

type MinimalComponentType<P>
    = ((props: P) => ReactNode) |
    MinimalClassComponent<P>

export interface MuiWidgetsBindingCustom<A = UIStoreActions, WP extends WidgetProps<{}, A> = WidgetProps<{}, A>> {
    [key: string]: MinimalComponentType<WP>
}

export interface MuiComponentsBinding {
    InfoRenderer?: ComponentType<InfoRendererProps>
}

export type MuiWidgetsBinding<A = UIStoreActions, WP extends WidgetProps<{}, A> = WidgetProps<{}, A>> =
    Omit<WidgetsBindingComponents, 'widgetPlugins'> &
    MuiComponentsBinding &
    {
        widgetPlugins?: ComponentType<WP & Omit<WidgetPluginProps<{}, A>, keyof WP>>[]
    } &
    {
        widgets?: WidgetsBindingRoot<MuiWidgetsBindingTypes<A, WP>, MuiWidgetsBindingCustom<A, WP>>
    } &
    {
        matchWidget?: (props: MatchProps<WP>) => null | (<PWidget>(props: Omit<NoInfer<PWidget>, keyof WP> & WP) => ReactNode)
    }
