import React from 'react'
import { List } from 'immutable'
import { WidgetsBindingFactory, WidgetProps } from '@ui-schema/react/Widgets'
import { WidgetPluginPayload } from '@ui-schema/system/WidgetPlugin'
import { onErrorHandler } from '@ui-schema/system/ValidatorErrors'

export interface WidgetPluginProps<W extends WidgetsBindingFactory = WidgetsBindingFactory> extends WidgetProps<W>, WidgetPluginPayload {
    // must be transformed from list to boolean `required` by a plugin
    requiredList?: List<any>

    // listen from a hoisted component for `errors` changing,
    // useful for some performance optimizes like at ds-material Accordions
    // is executed in `WidgetRenderer`, not passed down to widget
    onErrors?: onErrorHandler
}

export type WidgetPluginType<C extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory> = React.ComponentType<WidgetPluginProps<W> & C>
