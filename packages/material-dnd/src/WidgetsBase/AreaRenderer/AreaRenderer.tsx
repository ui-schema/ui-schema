import React from 'react'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import IcDrag from '@mui/icons-material/DragHandle'
import IcDelete from '@mui/icons-material/Delete'
import { List } from 'immutable'
import { DraggableRendererProps, useDraggable } from '@ui-schema/kit-dnd/useDraggable'
import { DragDropSpec } from '@ui-schema/material-dnd/DragDropSpec'
import { DndBlocksRendererItemProps } from '@ui-schema/material-dnd/DndBlocksRenderer'
import { handleMouseMoveInDraggable } from '@ui-schema/material-dnd/handleMouseMoveInDraggable'
import { WithOnChange } from '@ui-schema/react/UIStore'
import { memo } from '@ui-schema/react/Utils/memo'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'

export const AreaRendererBase = <C extends HTMLElement = HTMLElement, S extends DragDropSpec = DragDropSpec>(
    {
        id, index,
        onChange, required,
        storeKeys, listSchema,
        block,
        noDragOnNodes = ['INPUT'],
    }: Omit<DraggableRendererProps, 'scope' | 'dataKeys'> & DndBlocksRendererItemProps & WithOnChange
): React.ReactElement => {
    const refRoot = React.useRef<C | null>(null)
    const {
        schema,/* idKey,*/ type,/* typeKey,*/ listKey,
        isDroppable,
    } = block
    // todo: refactor and fix `allowedTypes`
    //       - items inside of restricted lists must be able to have other children - but not other siblings - than the parent list allows
    const allowedTypesList = listSchema?.getIn(['dragDrop', 'allowed']) as List<string> | undefined
    const allowedTypesBlock = schema?.getIn(['dragDrop', 'allowed']) as List<string> | undefined
    const allowedTypes = allowedTypesList ? allowedTypesBlock?.concat(allowedTypesList) || allowedTypesList : allowedTypesBlock

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
        setDisableDrag, canDrag,
    } = useDraggable<C, S>({
        item: item as S,
        allowedTypes, refRoot,
    })

    drop(preview(refRoot))

    return <div
        // @ts-ignore
        ref={drag(refRoot)}
        data-item-id={id}
        draggable={canDrag}
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

            <Box
                style={{flexGrow: 1}}
                mx={1} my={2}
                onMouseMoveCapture={
                    handleMouseMoveInDraggable(
                        noDragOnNodes,
                        canDrag,
                        setDisableDrag,
                    )
                }
                onMouseLeave={(e) => {
                    e.stopPropagation()
                    setDisableDrag(false)
                }}
            >
                <WidgetEngine schema={schema} parentSchema={listSchema} storeKeys={storeKeys}/>
            </Box>

            <IconButton
                style={{
                    padding: 6,
                }}
                onClick={() => onChange({
                    storeKeys: storeKeys.splice(-1, 1),
                    type: 'list-item-delete',
                    index: storeKeys.last() as number,
                    schema,
                    required: required,
                })}
            >
                <IcDelete/>
            </IconButton>
        </Paper>
    </div>
}

export const AreaRenderer = memo(AreaRendererBase)
