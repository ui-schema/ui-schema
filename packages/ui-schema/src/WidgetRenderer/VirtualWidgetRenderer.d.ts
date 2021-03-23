import React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { WithValue } from '@ui-schema/ui-schema/UIStore'

export interface VirtualWidgetsMapping {
    default: null | React.ComponentType<WidgetProps>
    object: React.ComponentType<WidgetProps>
    array: React.ComponentType<VirtualArrayRendererProps>
}

export interface VirtualWidgetRendererProps {
    virtualWidgets?: VirtualWidgetsMapping
}

export const VirtualWidgetRenderer: React.ComponentType<WidgetProps & WithValue & VirtualWidgetRendererProps>

export interface VirtualArrayRendererProps {
    storeKeys: WidgetProps['storeKeys']
    schema: WidgetProps['schema']
    value: WithValue['value']
    widgets?: WidgetProps['widgets']
    virtualWidgets?: VirtualWidgetRendererProps['virtualWidgets']
}

export function VirtualArrayRenderer(props: VirtualArrayRendererProps): React.ReactElement
