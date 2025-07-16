import { UIMetaContext, UIMetaContextBase } from '@ui-schema/react/UIMeta'
import { WithOnChange, WithValuePlain } from '@ui-schema/react/UIStore'
import { schemaTypeIs } from '@ui-schema/ui-schema/schemaTypeIs'
import { schemaTypeIsDistinct } from '@ui-schema/ui-schema/schemaTypeIsDistinct'
import type { StoreKeys } from '@ui-schema/ui-schema/ValueStore'
import type { WidgetPayload, WidgetPayloadFieldSchema } from '@ui-schema/ui-schema/Widget'
import type { ComponentType, ReactNode } from 'react'
import { List, Map } from 'immutable'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { ObjectRendererBase as ObjectRenderer } from '@ui-schema/react/ObjectRenderer'
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
    const type = schema?.get('type')
    const virtualWidgets = virtualWidgetsProps || defaultVirtualWidgets

    let Widget: ComponentType<WidgetProps> | ComponentType<VirtualArrayRendererProps> | null = virtualWidgets['default']

    if (type) {
        if (
            schemaTypeIs(type, 'array')
            // multi-type matching: if array + another type are allowed, only use `array` if the value is it
            && (
                schemaTypeIsDistinct(type, 'array')
                || List.isList(value)
            )
        ) {
            Widget = virtualWidgets['array']
        } else if (schemaTypeIs(type, 'object')) {
            Widget = virtualWidgets['object']
        }
    } else {
        // if no `type` exists use the value type
        if (List.isList(value)) {
            Widget = virtualWidgets['array']
        } else if (Map.isMap(value)) {
            Widget = virtualWidgets['object']
        }
    }

    return Widget ? <Widget {...props} value={value}/> : null
}
