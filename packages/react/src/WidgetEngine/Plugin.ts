import { UIMetaContextInternal } from '@ui-schema/react/UIMeta'
import { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import { WithValidatorErrors } from '@ui-schema/ui-schema/SchemaPlugin'
import type { ComponentType } from 'react'
import { WidgetProps, BindingTypeGeneric } from '@ui-schema/react/Widget'
import { onErrorHandler } from '@ui-schema/ui-schema/ValidatorOutput'

/**
 * @todo improve when further refining ui-meta context, plugin props and widget props
 */
export type WidgetPluginProps<W = BindingTypeGeneric, A = UIStoreActions> =
    Omit<WidgetProps<W, A>, keyof UIMetaContextInternal> &
    UIMetaContextInternal<W, WidgetProps<W, A> & WithValidatorErrors> &
    WithValidatorErrors &
    {
        // listen from a hoisted component for `errors` changing,
        // useful for some performance optimizes like at ds-material Accordions
        // is executed in `WidgetRenderer`, not passed down to widget
        onErrors?: onErrorHandler
    }

export type WidgetPluginType = ComponentType<WidgetPluginProps>
