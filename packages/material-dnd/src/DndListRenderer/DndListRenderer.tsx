import type { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import type { ComponentType, ReactNode } from 'react'
import { List, Map, OrderedMap } from 'immutable'
import { DraggableRendererProps } from '@ui-schema/kit-dnd/useDraggable'
import { WidgetProps } from '@ui-schema/react/Widget'
import { extractValue, WithOnChange, WithValuePlain } from '@ui-schema/react/UIStore'
import { StoreKeys } from '@ui-schema/ui-schema/ValueStore'
import { memo } from '@ui-schema/react/Utils/memo'

export interface DndListItemComponentProps extends Pick<WidgetProps, 'storeKeys' | 'schema' | 'parentSchema' | 'required'> {
    fullDrag?: boolean
    onChange: WithOnChange['onChange']
    itemType: string
    noDragOnNodes?: string[]
}

export interface DndListRendererProps {
    idKey: string

    Item: ComponentType<DndListItemComponentProps & DraggableRendererProps>

    // use to create a globally unique list where items can't move in/out
    scoped?: string

    // the schema of the `array` level
    parentSchema: SomeSchema

    // either `itemsSchema` OR `schemaFromArea`L
    //
    // the schema for the `array` items
    itemsSchema: SomeSchema

    storeKeys: StoreKeys
    required?: boolean

    // to tell this component renders non-droppable
    itemType: string
}

export type DndListRendererType = (props: DndListRendererProps) => ReactNode

export const DndListRendererBase = (
    {
        idKey, scoped,
        value,
        // remove `internalValue` from the widget, performance optimize
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        internalValue,
        storeKeys,
        Item, parentSchema,
        onChange, required,
        itemsSchema, itemType,
    }: DndListRendererProps & WithValuePlain & WithOnChange,
): ReactNode => {
    if (!List.isList(value)) return null
    // extracting and calculating the list size here, not passing down the actual list for performance reasons
    // https://github.com/ui-schema/ui-schema/issues/133
    return value?.map((val, j: number) => {
        if (!OrderedMap.isOrderedMap(val) && !Map.isMap(val)) {
            console.error('Detected non-object in DndListRenderer, atm. only objects are supported as list elements.', storeKeys?.toJS())
            return null
        }
        const itemCount = value.size
        const blockId = val.get(idKey) as string
        // this return wires together UI-Schema with Kit DnD (and thus react-dnd) for one list
        return <Item
            key={blockId}

            id={blockId}
            isLast={j >= (itemCount - 1)}
            isFirst={j === 0}

            index={j}
            // @ts-ignore
            dataKeys={storeKeys as List<number>}
            scope={scoped}
            itemType={itemType as string}

            storeKeys={storeKeys.push(j)}
            schema={itemsSchema as SomeSchema}
            parentSchema={parentSchema}
            onChange={onChange}
            // passing the `required` of the object down, so e.g. `list-item-delete` correctly also deletes an empty required array
            required={required}
        />
    }).valueSeq() || null
}

export const DndListRenderer = extractValue(memo(DndListRendererBase)) as DndListRendererType
