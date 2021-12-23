import { extractValue, memo, StoreSchemaType, WidgetProps, WithOnChange, WithValue } from '@ui-schema/ui-schema'
import React from 'react'
import { List, Map, OrderedMap } from 'immutable'
import { DraggableRendererProps } from '@ui-schema/kit-dnd/useDraggable'

export interface DndListItemComponentProps extends Pick<WidgetProps, 'storeKeys' | 'schema' | 'parentSchema' | 'required'> {
    fullDrag?: boolean
    onChange: WithOnChange['onChange']
    itemType: string
}

export interface DndListRendererProps extends Pick<WidgetProps, 'storeKeys' | 'required'> {
    idKey: string

    Item: React.ComponentType<DndListItemComponentProps & DraggableRendererProps>

    // use to create a globally unique list where items can't move in/out
    scoped?: string

    // the schema of the `array` level
    parentSchema: WidgetProps['parentSchema']

    // either `itemsSchema` OR `schemaFromArea`L
    //
    // the schema for the `array` items
    itemsSchema: WidgetProps['schema']

    // to tell this component renders non-droppable
    itemType: string
}

export type DndListRendererType = (props: DndListRendererProps) => React.ReactElement

export const DndListRendererBase = (
    {
        idKey, scoped,
        value,
        // remove `internalValue` from the widget, performance optimize
        // @ts-ignore
        // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
        internalValue,
        storeKeys,
        Item, parentSchema,
        onChange, required,
        itemsSchema, itemType,
    }: DndListRendererProps & WithValue
): React.ReactElement => {
    // extracting and calculating the list size here, not passing down the actual list for performance reasons
    // https://github.com/ui-schema/ui-schema/issues/133
    return value?.map((val: OrderedMap<string, any>, j: number) => {
        if (!OrderedMap.isOrderedMap(val) && !Map.isMap(val)) {
            console.error('Detected non-object in DndListRenderer, atm. only objects are supported as list elements.', storeKeys?.toJS())
            return null
        }
        const itemCount = value.size

        // this return wires together UI-Schema with Kit DnD (and thus react-dnd) for one list
        return <Item
            key={val.get(idKey)}

            id={val.get(idKey)}
            isLast={j >= (itemCount - 1)}
            isFirst={j === 0}

            index={j}
            dataKeys={storeKeys as List<number>}
            scope={scoped}
            itemType={itemType as string}

            storeKeys={storeKeys.push(j)}
            schema={itemsSchema as StoreSchemaType}
            parentSchema={parentSchema}
            onChange={onChange}
            // passing the `required` of the object down, so e.g. `list-item-delete` correctly also deletes an empty required array
            required={required}
        />
    }).valueSeq() || null
}

export const DndListRenderer = extractValue(memo(DndListRendererBase)) as DndListRendererType
