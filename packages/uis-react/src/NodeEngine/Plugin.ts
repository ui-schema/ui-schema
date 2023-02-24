import React from 'react'
import { List } from 'immutable'
import { WidgetsBindingFactory, WidgetProps } from '@ui-schema/react/Widgets'
import { WidgetPluginPayload } from '@ui-schema/system/WidgetPlugin'
import { onErrorHandler } from '@ui-schema/system/ValidatorErrors'
import { WithValue } from '@ui-schema/react/UIStore'

export type WidgetPluginProps<W extends WidgetsBindingFactory = WidgetsBindingFactory> = WidgetPluginPayload & WidgetProps<W> & WithValue & {
    // must be transformed from list to boolean `required` by a plugin
    requiredList?: List<any>

    // listen from a hoisted component for `errors` changing,
    // useful for some performance optimizes like at ds-material Accordions
    // is executed in `WidgetRenderer`, not passed down to widget
    onErrors?: onErrorHandler
}

export type WidgetPluginType<C extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory> = React.ComponentType<WidgetPluginProps<W> & C>
