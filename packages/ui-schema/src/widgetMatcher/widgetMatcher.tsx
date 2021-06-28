import React from 'react'
import { WithValue } from '@ui-schema/ui-schema/UIStore'
import { ObjectRenderer } from '@ui-schema/ui-schema/ObjectRenderer'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { WidgetsBindingBase } from '@ui-schema/ui-schema/WidgetsBinding'
import { VirtualWidgetRenderer } from '@ui-schema/ui-schema/WidgetRenderer/VirtualWidgetRenderer'

export interface NoWidgetProps {
    scope: string
    matching: string
}

const NoWidget = ({scope, matching}: NoWidgetProps) => <>missing-{scope}-{matching}</>

export function widgetMatcher<B extends WidgetsBindingBase>(
    {
        isVirtual,
        WidgetOverride,
        widgetName,
        schemaType,
        widgets,
        NoWidget: NoWidgetCustom,
    }:
        {
            isVirtual: boolean
            WidgetOverride?: React.ComponentType<WidgetProps>
            widgetName: string | undefined
            schemaType: string
            widgets: B
            NoWidget?: React.ComponentType<NoWidgetProps>
        }
): React.ComponentType<WidgetProps> | React.ComponentType<WidgetProps & WithValue> | null {
    const NoW = NoWidgetCustom || NoWidget
    let Widget: React.ComponentType<WidgetProps> | React.ComponentType<WidgetProps & WithValue> | null

    // getting the to-render component based on if it finds a custom object-widget or a widget extending native-types
    // or it is virtual at all or there is a custom override
    if (isVirtual) {
        Widget = VirtualWidgetRenderer
    } else if (WidgetOverride) {
        Widget = WidgetOverride
    } else if (widgetName && widgets.custom) {
        if (widgets.custom[widgetName]) {
            Widget = widgets.custom[widgetName]
        } else {
            // eslint-disable-next-line react/display-name
            Widget = () => <NoW scope={'custom'} matching={widgetName}/>
            Widget.displayName = 'NoWidgetCustom'
        }
    } else if (schemaType && widgets.types) {
        if (schemaType === 'object') {
            Widget = ObjectRenderer
        } else if (widgets.types[schemaType]) {
            Widget = widgets.types[schemaType]
        } else if (schemaType === 'null') {
            Widget = null
        } else {
            // eslint-disable-next-line react/display-name
            Widget = () => <NoW scope={'type'} matching={schemaType}/>
            Widget.displayName = 'NoWidgetType'
        }
    } else {
        // eslint-disable-next-line react/display-name
        Widget = () => <NoW scope={'any'} matching={schemaType}/>
        Widget.displayName = 'NoWidgetAny'
    }
    return Widget
}
