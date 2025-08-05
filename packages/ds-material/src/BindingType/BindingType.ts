import type { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import type { SchemaKeywordType } from '@ui-schema/ui-schema/CommonTypings'
import type { WidgetMatch } from '@ui-schema/ui-schema/matchWidget'
import type { ComponentType } from 'react'
import type { WidgetMatchProps, MinimalComponentType, WidgetProps, BindingComponents } from '@ui-schema/react/Widget'
import type { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import type { InfoRendererProps } from '@ui-schema/ds-material/Component'

export type MuiBindingWidgets<A = UIStoreActions, WP extends WidgetProps<{}, A> = WidgetProps<{}, A>> =
    { [K in SchemaKeywordType]?: MinimalComponentType<WP> } &
    Record<string, MinimalComponentType<WP>>

export interface MuiBindingComponents {
    InfoRenderer?: ComponentType<InfoRendererProps>
}

export type MuiBinding<A = UIStoreActions, WP extends WidgetProps<{}, A> = WidgetProps<{}, A>> =
    MuiBindingComponents &
    Omit<BindingComponents, 'widgetPlugins'> &
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
        widgets?: MuiBindingWidgets<A, WP>
    } &
    {
        matchWidget?: (props: WidgetMatchProps<WP>) => null | WidgetMatch<MinimalComponentType<WP>>
    }
