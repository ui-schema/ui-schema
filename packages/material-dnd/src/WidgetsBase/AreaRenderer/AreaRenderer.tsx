import { memo, PluginStack, WithOnChange } from '@ui-schema/ui-schema'
import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import IcDrag from '@material-ui/icons/DragHandle'
import IcDelete from '@material-ui/icons/Delete'
import { List } from 'immutable'
import { DraggableRendererProps, useDraggable } from '@ui-schema/kit-dnd/useDraggable'
import { DragDropSpec } from '@ui-schema/material-dnd/DragDropSpec'
import { DndBlocksRendererItemProps } from '@ui-schema/material-dnd/DndBlocksRenderer'

export const AreaRendererBase = <C extends HTMLElement = HTMLElement, S extends DragDropSpec = DragDropSpec>(
    {
        id, index,
        onChange, required,
        storeKeys, listSchema,
        block,
    }: Omit<DraggableRendererProps, 'scope' | 'dataKeys'> & DndBlocksRendererItemProps & WithOnChange
): React.ReactElement => {
    const refRoot = React.useRef<C | null>(null)
    const {
        schema,/* idKey,*/ type,/* typeKey,*/ listKey,
        isDroppable,
    } = block
    const allowedTypes = schema?.getIn(['dragDrop', 'allowed']) as List<string> | undefined

    const item = React.useMemo(() => ({
        type: type,
        id: id,
        // dataKeys do not include the `index`, whereas storeKeys do
        dataKeys: storeKeys.splice(-1, 1),
        listKey: listKey,
        isDroppable: isDroppable,
        index: index,
    }) as unknown as S, [
        type, listKey,
        id, index,
        storeKeys,
        isDroppable,
    ])

    const {
        drop, preview, drag,
        isDragging,
    } = useDraggable<C, S>({
        item: item as S,
        allowedTypes, refRoot,
    })

    drop(preview(refRoot))

    return <div
        // @ts-ignore
        ref={drag(refRoot)}
        data-item-id={id}
        style={{
            flexBasis: '100%',
            padding: 3,
            margin: 0,
            display: 'flex',
        }}
    >
        <Paper
            variant={'outlined'}
            style={{
                padding: 6,
                display: 'flex',
                alignItems: 'center',
                opacity: isDragging ? 0.4 : 1,
                flexGrow: 1,
                transition: 'opacity 0.25s ease-out',
            }}
        >
            <IconButton
                style={{
                    cursor: 'grab',
                    padding: 6,
                }}
            >
                <IcDrag/>
            </IconButton>

            <Box style={{flexGrow: 1}} mx={1} my={2}>
                <PluginStack schema={schema} parentSchema={listSchema} storeKeys={storeKeys}/>
            </Box>

            <IconButton
                style={{
                    padding: 6,
                }}
                onClick={() => onChange(
                    storeKeys.splice(-1, 1), ['value', 'internal'],
                    {
                        type: 'list-item-delete',
                        index: storeKeys.last() as number,
                        schema,
                        required: required,
                    },
                )}
            >
                <IcDelete/>
            </IconButton>
        </Paper>
    </div>
}

export const AreaRenderer = memo(AreaRendererBase)
