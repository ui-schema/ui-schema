import type { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import type { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import type { MinimalComponentType, WidgetProps, BindingTypeGeneric } from '@ui-schema/react/Widget'
import type { SchemaKeywordType } from '@ui-schema/ui-schema/CommonTypings'
import type { ComponentType } from 'react'

export type BtsBinding<A = UIStoreActions, WP extends WidgetProps<{}, A> = WidgetProps<{}, A>> =
    Omit<BindingTypeGeneric<
        {
            [K in SchemaKeywordType]?: ComponentType<WidgetProps>
        } &
        {
            [k: string]: ComponentType<WidgetProps>
        }
    >, 'widgetPlugins'> &
    {
        widgetPlugins?: MinimalComponentType<WP & Omit<WidgetPluginProps<{}, A>, keyof WP>>[]
        WidgetRenderer?: MinimalComponentType<WP & Omit<WidgetPluginProps<{}, A>, keyof WP>>
    }
