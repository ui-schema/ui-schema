import { UIMetaContext, UIMetaContextBase } from '@ui-schema/react/UIMeta'
import { WithOnChange, WithValuePlain } from '@ui-schema/react/UIStore'
import type { StoreKeys } from '@ui-schema/ui-schema/ValueStore'
import type { WidgetPayload, WidgetPayloadFieldSchema } from '@ui-schema/ui-schema/Widget'
import type { ComponentType, ReactNode } from 'react'
import { List } from 'immutable'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { ObjectRendererBase as ObjectRenderer } from '@ui-schema/react-json-schema/ObjectRenderer'
import { schemaTypeToDistinct } from '@ui-schema/ui-schema/schemaTypeToDistinct'
import type { WidgetProps } from '@ui-schema/react/Widget'

export interface VirtualArrayRendererProps {
    storeKeys: StoreKeys
    schema: WidgetPayloadFieldSchema['schema']
    value: unknown
    virtualWidgets?: VirtualWidgetRendererProps['virtualWidgets']
    binding?: UIMetaContext['binding']
}

export const VirtualArrayRenderer = (
    {storeKeys, value, schema, virtualWidgets, binding}: VirtualArrayRendererProps,
): ReactNode => {
    const items = schema?.get('items')
    return List.isList(value) ? value.map((_val, i) =>
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
    default: null | ComponentType<WidgetProps & Partial<WithValuePlain & WithOnChange>>
    object: ComponentType<WidgetProps & Partial<WithValuePlain & WithOnChange>>
    array: ComponentType<VirtualArrayRendererProps>
}

export interface VirtualWidgetRendererProps extends WidgetPayload, UIMetaContextBase, WithOnChange, WithValuePlain {
    virtualWidgets?: VirtualWidgetsMapping
}

export const defaultVirtualWidgets: VirtualWidgetsMapping = {
    'default': null,
    'object': ObjectRenderer,
    'array': VirtualArrayRenderer,
}

export const VirtualWidgetRenderer = (props: VirtualWidgetRendererProps): ReactNode => {
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

    return Widget ? <Widget {...props} value={value}/> : null
}
