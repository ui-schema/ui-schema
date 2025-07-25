import type { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import * as React from 'react'
import { List, Map, OrderedMap } from 'immutable'
import { DndBlock, useBlocks } from '@ui-schema/material-dnd/DragDropBlockProvider'
import { DndListItemComponentProps } from '@ui-schema/material-dnd/DndListRenderer'
import { DraggableRendererProps } from '@ui-schema/kit-dnd/useDraggable'
import { matchBlock } from '@ui-schema/material-dnd/DndBlocksRenderer'
import { WidgetProps } from '@ui-schema/react/Widget'
import { extractValue, WithOnChange, WithValuePlain } from '@ui-schema/react/UIStore'
import { memo } from '@ui-schema/react/Utils/memo'

export interface DndBlocksRendererItemProps extends Pick<WidgetProps, 'storeKeys' | 'required'> {
    block: DndBlock
    listSchema: SomeSchema
    noDragOnNodes?: string[]
}

export interface DndBlocksRendererProps extends Pick<WidgetProps, 'storeKeys' | 'required'> {
    Item: React.ComponentType<Omit<DraggableRendererProps, 'scope' | 'dataKeys'> & DndBlocksRendererItemProps & WithOnChange>

    // the schema of the `array` level
    listSchema: SomeSchema
}

export type DndBlocksRendererType = (props: DndBlocksRendererProps) => React.ReactElement

export const DndBlocksRendererBase = (
    {
        value,
        // remove `internalValue` from the widget, performance optimize
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        internalValue,
        storeKeys,
        Item, listSchema,
        onChange, required,
    }: DndBlocksRendererProps & DndListItemComponentProps & WithOnChange & WithValuePlain,
): React.ReactElement => {
    const {blocks} = useBlocks()

    // todo: optimize/remove block matching, as this could be expensive on big lists and many available blocks
    //       especially as it is re-matching every level in one PluginStack tree, on each change, no matter how deep the change was
    const matched: ({
        block: DndBlock
        id: string
    } | undefined)[] = React.useMemo(() => {
        if (!List.isList(value)) return []
        return value?.map((val) => {
            if (!OrderedMap.isOrderedMap(val) && !Map.isMap(val)) {
                throw new Error('Detected non-object in DndBlocksRenderer, atm. only objects are supported as list elements at storeKeys:' + storeKeys.toArray().join('.'))
            }
            return matchBlock(blocks, val)
        }).toArray()
    }, [blocks, value, storeKeys])

    return <>
        {matched?.map((info, j: number) => {
            if (!info || !info.block) return null
            const {block, id} = info
            // this return wires together UI-Schema with Kit DnD (and thus react-dnd) for one list
            return <Item
                key={id}
                id={id}

                index={j}
                isLast={j >= (matched.length - 1)}
                isFirst={j === 0}

                storeKeys={storeKeys.push(j)}
                listSchema={listSchema as SomeSchema}
                block={block}
                onChange={onChange}
                // passing the `required` from the parent down, so e.g. `list-item-delete` correctly also deletes an empty required array
                required={required}
            />
        })}
    </>
}

export const DndBlocksRenderer = extractValue(memo(DndBlocksRendererBase)) as DndBlocksRendererType
