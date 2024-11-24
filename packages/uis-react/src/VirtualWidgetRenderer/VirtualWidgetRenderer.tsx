import React from 'react'
import { List } from 'immutable'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { ObjectRenderer } from '@ui-schema/react-json-schema/ObjectRenderer'
import { schemaTypeToDistinct } from '@ui-schema/system/schemaTypeToDistinct'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { WithValue } from '@ui-schema/react/UIStore'

export interface VirtualArrayRendererProps {
    storeKeys: WidgetProps['storeKeys']
    schema: WidgetProps['schema']
    value: WithValue['value']
    widgets?: WidgetProps['widgets']
    virtualWidgets?: VirtualWidgetRendererProps['virtualWidgets']
}

export const VirtualArrayRenderer = (
    {storeKeys, value, schema, virtualWidgets, widgets}: VirtualArrayRendererProps,
): React.ReactElement => {
    const items = schema?.get('items')
    return value ? value.map((_val, i) =>
        <WidgetEngine<VirtualWidgetRendererProps>
            key={i}
            // @ts-ignore
            schema={List.isList(items) ? items.get(i) : items}
            parentSchema={schema}
            storeKeys={storeKeys.push(i)}
            virtualWidgets={virtualWidgets}
            widgets={widgets}
            isVirtual
        />,
    ).valueSeq() : null
}

export interface VirtualWidgetsMapping {
    default: null | React.ComponentType<WidgetProps & Partial<WithValue>>
    object: React.ComponentType<WidgetProps & Partial<WithValue>>
    array: React.ComponentType<VirtualArrayRendererProps>
}

export interface VirtualWidgetRendererProps extends WidgetProps {
    virtualWidgets?: VirtualWidgetsMapping
}

export const getVirtualWidgets = (): VirtualWidgetsMapping => ({
    'default': null,
    'object': ObjectRenderer,
    'array': VirtualArrayRenderer,
})

const defaultVirtualWidgets = getVirtualWidgets()

export const VirtualWidgetRenderer = <P extends WithValue & VirtualWidgetRendererProps>(props: P): React.ReactElement => {
    const {
        schema, value,
        virtualWidgets: virtualWidgetsProps,
    } = props
    const type = schemaTypeToDistinct(schema?.get('type'))
    const virtualWidgets = virtualWidgetsProps || defaultVirtualWidgets

    let Widget: React.ComponentType<WidgetProps> | React.ComponentType<VirtualArrayRendererProps> | null = virtualWidgets['default']

    if (type) {
        if (type === 'object') {
            Widget = virtualWidgets['object']
        } else if (type === 'array') {
            Widget = virtualWidgets['array']
        }
    }

    return Widget ? <Widget {...props} value={value as WithValue['value']}/> : null as unknown as React.ReactElement
}
