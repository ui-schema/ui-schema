import { memo, PluginStack, TransTitle } from '@ui-schema/ui-schema'
import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography, { TypographyProps } from '@material-ui/core/Typography'
import IcDrag from '@material-ui/icons/DragHandle'
import IcDelete from '@material-ui/icons/Delete'
import { DndListItemComponentProps } from '@ui-schema/material-dnd/DndListRenderer'
import { List } from 'immutable'
import { DraggableRendererProps, useDraggable } from '@ui-schema/kit-dnd/useDraggable'
import { DragDropSpec } from '@ui-schema/material-dnd/DragDropSpec'

export const SortableListItemBase = <C extends HTMLElement = HTMLElement, S extends DragDropSpec = DragDropSpec>(
    {
        id, index,
        onChange, required,
        /*isOver,
        isFirst, isLast,*/
        fullDrag,
        itemType, dataKeys, scope,
        storeKeys, schema, parentSchema,
    }: DndListItemComponentProps & DraggableRendererProps
): React.ReactElement => {
    const refRoot = React.useRef<C | null>(null)
    const allowedTypes = schema?.getIn(['dragDrop', 'allowed']) as List<string> | undefined

    const item = React.useMemo(() => ({
        type: itemType,
        id: id,
        dataKeys: dataKeys,
        index: index,
    }), [
        itemType,
        id, dataKeys, index,
    ])

    const {
        drop, preview, drag,
        // canDrop, isOver,
        isDragging,
    } = useDraggable<C, S>({
        item: item as S,
        allowedTypes, scope, refRoot,
    })

    drop(preview(refRoot))

    const rr = fullDrag ? drag(refRoot) : refRoot

    return <div
        // @ts-ignore
        ref={rr}
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
                //border: '1px solid #333333',
                //background: !isDragging && isOver ? '#e7e6e6' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                opacity: isDragging ? 0.4 : 1,
                flexGrow: 1,
                transition: 'opacity 0.25s ease-out, background 0.16s ease-in',
            }}
        >
            <IconButton
                ref={fullDrag ? undefined : drag}
                style={{
                    cursor: 'grab',
                    padding: 6,
                }}
            >
                <IcDrag/>
            </IconButton>

            <Box style={{flexGrow: 1}} mx={1} my={2}>
                {schema.getIn(['view', 'showTitle']) ? <Typography
                    variant={(schema.getIn(['view', 'titleVariant']) as TypographyProps['variant']) || 'subtitle1'}
                    component={(schema.getIn(['view', 'titleComp']) as React.ElementType) || 'p'}
                    gutterBottom
                >
                    <TransTitle schema={schema} storeKeys={storeKeys} ownKey={index}/>
                </Typography> : null}

                <PluginStack schema={schema} parentSchema={parentSchema} storeKeys={storeKeys}/>
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

export const SortableListItem = memo(SortableListItemBase)
