import React from 'react'
import { WidgetsBindingFactory, WidgetProps } from '@ui-schema/react/Widgets'
import { WidgetPluginPayload } from '@ui-schema/system/WidgetPlugin'
import { onErrorHandler } from '@ui-schema/system/ValidatorOutput'
import { WithValue } from '@ui-schema/react/UIStore'

export type WidgetPluginProps<W extends WidgetsBindingFactory = WidgetsBindingFactory> = WidgetPluginPayload & WidgetProps<W> & WithValue & {
    // listen from a hoisted component for `errors` changing,
    // useful for some performance optimizes like at ds-material Accordions
    // is executed in `WidgetRenderer`, not passed down to widget
    onErrors?: onErrorHandler
}

export type WidgetPluginType<C = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory> = React.ComponentType<WidgetPluginProps<W> & C>
