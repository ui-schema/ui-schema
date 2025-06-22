import type { ComponentType } from 'react'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { WidgetPluginPayload } from '@ui-schema/system/WidgetPlugin'
import { onErrorHandler } from '@ui-schema/system/ValidatorOutput'
import { WithValue } from '@ui-schema/react/UIStore'

export type WidgetPluginProps = WidgetPluginPayload & WidgetProps & WithValue & {
    // listen from a hoisted component for `errors` changing,
    // useful for some performance optimizes like at ds-material Accordions
    // is executed in `WidgetRenderer`, not passed down to widget
    onErrors?: onErrorHandler
}

export type WidgetPluginType<C = {}> = ComponentType<WidgetPluginProps & C>
