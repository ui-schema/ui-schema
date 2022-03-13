import React from 'react'
import { ObjectRenderer } from '@ui-schema/ui-schema/ObjectRenderer'
import { WidgetOverrideType, WidgetType } from '@ui-schema/ui-schema/Widget'
import { WidgetsBindingFactory, WidgetsBindingLooseComponents } from '@ui-schema/ui-schema/WidgetsBinding'
import { VirtualWidgetRenderer } from '@ui-schema/ui-schema/WidgetRenderer/VirtualWidgetRenderer'
import { schemaTypeToDistinct } from '@ui-schema/ui-schema/Utils/schemaTypeToDistinct'
import { SchemaTypesType } from '@ui-schema/ui-schema'

export interface NoWidgetProps {
    scope: string
    matching?: string
}

const NoWidget = ({scope, matching}: NoWidgetProps) => <>missing-{scope}{matching ? '-' + matching : ''}</>

export function widgetMatcher<W extends WidgetsBindingFactory<{}, WidgetsBindingLooseComponents, WidgetsBindingLooseComponents>>(
    {
        isVirtual,
        WidgetOverride,
        widgetName,
        schemaType,
        widgets,
        NoWidget: NoWidgetCustom,
    }: {
        isVirtual: boolean
        WidgetOverride?: WidgetOverrideType<{}, {}, W>
        widgetName: string | undefined
        schemaType: SchemaTypesType
        widgets: W
        NoWidget?: React.ComponentType<NoWidgetProps>
    }
): WidgetType<{}, W> | null {
    const NoW = NoWidgetCustom || NoWidget
    let Widget: WidgetType<{}, W> | null = null

    // getting the to-render component based on if it finds a custom object-widget or a widget extending native-types,
    // or it is virtual at all or there is a custom override
    if (isVirtual) {
        Widget = VirtualWidgetRenderer as WidgetType<{}, W>
    } else if (WidgetOverride) {
        Widget = WidgetOverride
    } else if (widgetName && widgets.custom) {
        if (widgets.custom[widgetName]) {
            Widget = widgets.custom[widgetName] as WidgetType<{}, W>
        } else {
            // eslint-disable-next-line react/display-name
            Widget = () => <NoW scope={'custom'} matching={widgetName}/>
            Widget.displayName = 'NoWidgetCustom'
        }
    } else if (schemaType && widgets.types) {
        const distinctInputType = schemaTypeToDistinct(schemaType)

        if (distinctInputType) {
            if (distinctInputType === 'object') {
                Widget = ObjectRenderer
            } else if (widgets.types[distinctInputType]) {
                Widget = widgets.types[distinctInputType] as WidgetType<{}, W>
            } else if (distinctInputType === 'null') {
                Widget = null
            } else {
                // eslint-disable-next-line react/display-name
                Widget = () => <NoW scope={'type'} matching={distinctInputType}/>
                Widget.displayName = 'NoWidgetType'
            }
        }
    }

    return Widget
}
