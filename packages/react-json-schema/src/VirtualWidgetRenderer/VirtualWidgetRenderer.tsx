import type { UIMetaContext } from '@ui-schema/react/UIMeta'
import type { StoreKeys } from '@ui-schema/ui-schema/ValueStore'
import type { WidgetPayloadFieldSchema } from '@ui-schema/ui-schema/Widget'
import type { ComponentType, ReactNode } from 'react'
import { List } from 'immutable'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { ObjectRenderer } from '@ui-schema/react-json-schema/ObjectRenderer'
import { schemaTypeToDistinct } from '@ui-schema/ui-schema/schemaTypeToDistinct'
import type { WidgetProps } from '@ui-schema/react/Widgets'
import type { WithValue, WithValuePlain } from '@ui-schema/react/UIStore'

export interface VirtualArrayRendererProps {
    storeKeys: StoreKeys
    schema: WidgetPayloadFieldSchema['schema']
    value: WithValue['value']
    virtualWidgets?: VirtualWidgetRendererProps['virtualWidgets']
    binding?: UIMetaContext['binding']
}

export const VirtualArrayRenderer = (
    {storeKeys, value, schema, virtualWidgets, binding}: VirtualArrayRendererProps,
): ReactNode => {
    const items = schema?.get('items')
    return value ? value.map((_val, i) =>
        <WidgetEngine<VirtualWidgetRendererProps>
            key={i}
            schema={List.isList(items) ? items.get(i) : items}
            parentSchema={schema}
            storeKeys={storeKeys.push(i)}
            virtualWidgets={virtualWidgets}
            binding={binding}
            isVirtual
        />,
    ).valueSeq() : null
}

export interface VirtualWidgetsMapping {
    default: null | ComponentType<WidgetProps & Partial<WithValue>>
    object: ComponentType<WidgetProps & Partial<WithValue>>
    array: ComponentType<VirtualArrayRendererProps>
}

export interface VirtualWidgetRendererProps extends WidgetProps {
    virtualWidgets?: VirtualWidgetsMapping
}

export const defaultVirtualWidgets: VirtualWidgetsMapping = {
    'default': null,
    'object': ObjectRenderer,
    'array': VirtualArrayRenderer,
}

export const VirtualWidgetRenderer = (props: WithValuePlain & VirtualWidgetRendererProps): ReactNode => {
    const {
        schema, value,
        virtualWidgets: virtualWidgetsProps,
    } = props
    const type = schemaTypeToDistinct(schema?.get('type'))
    const virtualWidgets = virtualWidgetsProps || defaultVirtualWidgets

    let Widget: ComponentType<WidgetProps> | ComponentType<VirtualArrayRendererProps> | null = virtualWidgets['default']

    if (type) {
        if (type === 'object') {
            Widget = virtualWidgets['object']
        } else if (type === 'array') {
            Widget = virtualWidgets['array']
        }
    }

    return Widget ? <Widget {...props} value={value as WithValue['value']}/> : null
}
