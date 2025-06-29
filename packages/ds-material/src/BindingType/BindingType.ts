import type { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import type { WidgetMatch } from '@ui-schema/ui-schema/matchWidget'
import type { ComponentType, ReactNode } from 'react'
import type { MatchProps, MinimalComponentType, WidgetProps, WidgetsBindingComponents } from '@ui-schema/react/Widgets'
import type { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import type { InfoRendererProps } from '@ui-schema/ds-material/Component'

export type MuiWidgetsBindingWidgets<A = UIStoreActions, WP extends WidgetProps<{}, A> = WidgetProps<{}, A>> = {
    [k: string]: MinimalComponentType<WP> | null | undefined
}

export interface MuiComponentsBinding {
    InfoRenderer?: ComponentType<InfoRendererProps>
}

export type MuiWidgetsBinding<A = UIStoreActions, WP extends WidgetProps<{}, A> = WidgetProps<{}, A>> =
    Omit<WidgetsBindingComponents, 'widgetPlugins'> &
    MuiComponentsBinding &
    {
        widgetPlugins?: MinimalComponentType<WP & Omit<WidgetPluginProps<{}, A>, keyof WP>>[]
    } &
    {
        /**
         * The component which is rendered inside the WidgetEngine, after any widgetPlugin is applied.
         */
        WidgetRenderer?: MinimalComponentType<WP & Omit<WidgetPluginProps<{}, A>, keyof WP>>
    } &
    {
        // widgets?: WidgetsBindingRoot<MuiWidgetsBindingWidgets<A, WP>>
        widgets?: MuiWidgetsBindingWidgets<A, WP>
    } &
    {
        matchWidget?: (props: MatchProps<WP>) => null | WidgetMatch<<PWidget>(props: Omit<NoInfer<PWidget>, keyof WP> & WP) => ReactNode>
    }
