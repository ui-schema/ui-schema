import { onChangeHandler } from '@ui-schema/react/UIStore'
import { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { SchemaKeywordType } from '@ui-schema/ui-schema/CommonTypings'
import { WidgetsBindingRoot } from '@ui-schema/ui-schema/WidgetsBinding'
import { ComponentType, ReactNode } from 'react'
import { MatchProps, WidgetPropsComplete, WidgetsBindingComponents } from '@ui-schema/react/Widgets'
import type { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import { InfoRendererProps } from '@ui-schema/ds-material/Component'

// todo: remove compat. workaround once value typeguards exist
type LegacyPropsWithStore<A = UIStoreActions> =
    Omit<WidgetPropsComplete<A>, 'value' | 'internalValue' | 'onChange'>
    & { value: any, internalValue: any, onChange: onChangeHandler<A> }

export type MuiWidgetsBindingTypes<A = UIStoreActions, WP extends LegacyPropsWithStore<A> = LegacyPropsWithStore<A>> = {
    [K in SchemaKeywordType]?: (props: WP) => ReactNode
}

export interface MuiWidgetsBindingCustom<A = UIStoreActions, WP extends LegacyPropsWithStore<A> = LegacyPropsWithStore<A>> {
    // note: we can't use ComponentType here, as it leads to problems with FC vs. others and
    //       throwing errors if a component has optional props, which are defined are required in the binding,
    //       which is of course ok, as a widget can always rely on less, just not more (required) as defined in the shared interface
    [key: string]: (props: WP) => ReactNode
    // [key: string]: WidgetType<C, A>
}

export type MuiWidgetsBinding<A = UIStoreActions, WP extends LegacyPropsWithStore<A> = LegacyPropsWithStore<A>> =
    Omit<WidgetsBindingComponents, 'widgetPlugins'> &
    {
        InfoRenderer?: ComponentType<InfoRendererProps>
    } &
    {
        widgetPlugins?: ComponentType<WP & Omit<WidgetPluginProps, keyof WP>>[]
    } &
    {
        widgets?: WidgetsBindingRoot<MuiWidgetsBindingTypes<A, WP>, MuiWidgetsBindingCustom<A, WP>>
    } &
    {
        matchWidget?: (props: MatchProps<A, WP>) => null | (<PWidget>(props: Omit<NoInfer<PWidget>, keyof WP> & WP) => ReactNode)
    }
