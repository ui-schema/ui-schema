import React from 'react'
import { useDrop, DropTargetMonitor } from 'react-dnd'
import { onChangeHandler, StoreKeys, StoreSchemaType } from '@ui-schema/ui-schema'
import { AccessTooltipIcon } from '@ui-schema/ds-material'
import { handleDragEnd } from '@ui-schema/material-dnd/DragDropProvider/storeHelper'
import IcAdd from '@material-ui/icons/Add'
import Typography from '@material-ui/core/Typography'
import { BlockAddProps } from '@ui-schema/material-dnd/BlockSelection/BlockAddProps'
import { DraggableBlock } from '@ui-schema/material-dnd/DraggableBlock/DraggableBlock'
import { DragDropAdvancedContextType } from '@ui-schema/material-dnd/DragDropProvider/useDragDropContext'

export interface DroppableRootSelectProps {
    setAddSelectionIndex: BlockAddProps['setAddSelectionIndex']
    storeKeys: StoreKeys
    schema: StoreSchemaType
    onChange: typeof onChangeHandler
    moveDraggedValue: DragDropAdvancedContextType['moveDraggedValue']
    getSourceValues: DragDropAdvancedContextType['getSourceValues']
}

export const DroppableRootSelect: React.ComponentType<DroppableRootSelectProps> = (
    {
        setAddSelectionIndex,
        storeKeys,
        onChange, schema,
        getSourceValues, moveDraggedValue,
    }
) => {
    const ref = React.useRef<HTMLDivElement>(null)
    const allowedBlocks = schema.getIn(['dragDrop', 'allowed'])
    const [{handlerId}, drop] = useDrop(() => ({
        accept: 'BLOCK',
        hover(item: DraggableBlock, monitor: DropTargetMonitor) {
            if (!allowedBlocks || allowedBlocks.contains(item.$block)) {
                handleDragEnd(ref, onChange, item, storeKeys, monitor, getSourceValues, moveDraggedValue, true)
            }
        },
        canDrop: (item: DraggableBlock) => {
            return !allowedBlocks || allowedBlocks.contains(item.$block)
        },
    }), [allowedBlocks, ref, onChange, storeKeys, getSourceValues, moveDraggedValue])

    drop(ref)
    return <Typography
        innerRef={ref}
        variant={'subtitle2'} component={'button'}
        align={'center'} color={'textSecondary'}
        style={{
            position: 'absolute', width: '100%', height: '100%',
            //opacity: isDraggingOver ? 0.4 : 0.8,
            opacity: 0.8,
            top: 0, right: 0, bottom: 0, left: 0,
            border: 0, background: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        onClick={() => setAddSelectionIndex(storeKeys.last() as number)}
        data-handler-id={handlerId}
    >
        <span>
            <AccessTooltipIcon title={'Add New Block'}>
                <IcAdd fontSize={'inherit'} style={{verticalAlign: 'text-top'}}/>
            </AccessTooltipIcon>{' '}
            <span style={{paddingLeft: 2}}>Add a block!</span>
        </span>
    </Typography>
}
