import React from 'react'
import { useUID } from 'react-uid'
import { useDrag, useDrop, DropTargetMonitor, DragSourceMonitor } from 'react-dnd'
import Grow from '@material-ui/core/Grow'
import Typography from '@material-ui/core/Typography'
import IcDrag from '@material-ui/icons/DragHandle'
import IcDelete from '@material-ui/icons/Delete'
import IcDeleteOutline from '@material-ui/icons/DeleteOutline'
import IcInfo from '@material-ui/icons/Info'
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Fade from '@material-ui/core/Fade'
import IcArrowUpward from '@material-ui/icons/ArrowUpward'
import IcArrowDownward from '@material-ui/icons/ArrowDownward'
import useTheme from '@material-ui/core/styles/useTheme'
import { DraggableBlock, DraggableBlockProps } from '@ui-schema/material-dnd/DraggableBlock/DraggableBlock'
import { PluginStack } from '@ui-schema/ui-schema/PluginStack/PluginStack'
import { AccessTooltipIcon } from '@ui-schema/ds-material'
import { BlockAddHover } from '@ui-schema/material-dnd/BlockSelection/BlockAddHover'
import { handleDragEnd, handleMoveDown, handleMoveUp } from '@ui-schema/material-dnd/DragDropProvider/storeHelper'
import { memo } from '@ui-schema/ui-schema/Utils/memo/memo'
import { Trans } from '@ui-schema/ui-schema'

let BlockPanel: React.ComponentType<DraggableBlockProps> = (
    {
        storeKeys, blockId, onChange,
        parentSchema, schema,
        getSourceValues, moveDraggedValue,
        handleBlockDelete, blocksSize, setAddSelectionIndex,
    }
) => {
    const uid = useUID()
    const timer = React.useRef<number | undefined>()
    React.useEffect(() => {
        return () => window.clearTimeout(timer.current)
    }, [timer])
    const theme = useTheme()
    const [deleteConfirm, setDeleteConfirm] = React.useState(false)
    const [showInfo, setShowInfo] = React.useState(false)
    const [dragFocus, setDragFocus] = React.useState(false)

    const allowedBlocks = parentSchema.getIn(['dragDrop', 'allowed'])
    const refRoot = React.useRef<HTMLDivElement>(null)
    const [{handlerId}, drop] = useDrop<DraggableBlock, any, any>(() => ({
        accept: 'BLOCK',
        collect: (monitor: DropTargetMonitor) => ({
            //isOver: monitor.isOver({shallow: true}),
            handlerId: monitor.getHandlerId(),
        }),
        canDrop: (item: DraggableBlock, monitor: DropTargetMonitor) => {
            if (monitor.isOver({shallow: true})) {
                return !allowedBlocks || allowedBlocks.contains(item.$block)
            }
            return false
        },
        hover(item: DraggableBlock, monitor: DropTargetMonitor) {
            if (
                //monitor.isOver({shallow: true}) &&
                (!allowedBlocks || allowedBlocks.contains(item.$block))
            ) {
                handleDragEnd(refRoot, onChange, item, storeKeys, monitor, getSourceValues, moveDraggedValue)
            }
        },
    }), [allowedBlocks, refRoot, onChange, storeKeys, getSourceValues, moveDraggedValue])

    const [{isDragging}, drag, preview] = useDrag(() => ({
        item: {storeKeys: storeKeys, type: 'BLOCK', $block: blockId},
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging(),
        }),
        isDragging: (monitor: DragSourceMonitor) => storeKeys.equals(monitor.getItem().storeKeys),
    }), [storeKeys, blockId])

    const isLastEntry = storeKeys.last() >= blocksSize - 1

    drop(preview(refRoot))
    return <Grow in ref={refRoot}>
        <div
            style={{
                opacity: isDragging ? 0.2 : 1,
                display: 'flex',
                position: 'relative',
                borderBottom: isLastEntry ? 0 : '1px solid ' + theme.palette.divider,
                //background: isOver ? theme.palette.action.focus : 'none',
            }}
            data-handler-id={handlerId}
        >
            <div
                style={{
                    padding: theme.spacing(1) + 'px ' + theme.spacing(1) + 'px ' + theme.spacing(1) + 'px ' + theme.spacing(1.5) + 'px',
                    display: 'flex',
                    flexDirection: 'column',
                }}
                onMouseEnter={() => setDragFocus(true)}
                onMouseLeave={() => setDragFocus(false)}
            >
                <Fade in={dragFocus && storeKeys.last() > 0}>
                    <IconButton
                        color={'inherit'}
                        size={'medium'}
                        style={{
                            padding: 2,
                            fontSize: '.9rem',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginBottom: 0,
                        }}
                        onFocus={() => setDragFocus(true)}
                        onBlur={() => setDragFocus(false)}
                        onFocusVisible={e => {
                            e.stopPropagation()
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                            handleMoveUp(onChange, storeKeys)
                            setDragFocus(false)
                        }}
                        aria-labelledby={'uis-' + uid + '-up'}
                    >
                        <IcArrowUpward fontSize={'inherit'}/>
                        {/*
                            need to use aria label here,
                            as after moving an item, `AccessTooltipIcon` is sometimes still open
                        */}
                        <Typography component={'span'} variant={'srOnly'} id={'uis-' + uid + '-up'}>
                            <Trans text={'labels.move-up'}/>
                        </Typography>
                    </IconButton>
                </Fade>
                <span
                    ref={drag}
                    style={{padding: '4px 0'}}
                    tabIndex={0}
                    onFocus={() => setDragFocus(true)}
                    onBlur={() => setDragFocus(false)}
                    aria-labelledby={'uis-' + uid + '-drag'}
                >
                    <IcDrag style={{display: 'block', cursor: 'grab'}}/>
                    {/*
                        need to use aria label here,
                        as after moving an item, `AccessTooltipIcon` is sometimes still open
                    */}
                    <Typography component={'span'} variant={'srOnly'} id={'uis-' + uid + '-drag'}>
                        <Trans text={'labels.dnd-move-up-down'}/>
                    </Typography>
                </span>
                <Fade in={dragFocus && !isLastEntry}>
                    <IconButton
                        color={'inherit'}
                        size={'medium'}
                        style={{
                            padding: 2,
                            fontSize: '.9rem',
                            marginTop: 0,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}
                        onFocus={() => setDragFocus(true)}
                        onBlur={() => setDragFocus(false)}
                        onFocusVisible={e => {
                            e.stopPropagation()
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                            handleMoveDown(onChange, storeKeys)
                            setDragFocus(false)
                        }}
                        aria-labelledby={'uis-' + uid + '-down'}
                    >
                        <IcArrowDownward fontSize={'inherit'}/>
                        {/*
                            need to use aria label here,
                            as after moving an item, `AccessTooltipIcon` is sometimes still open
                        */}
                        <Typography component={'span'} variant={'srOnly'} id={'uis-' + uid + '-down'}>
                            <Trans text={'labels.move-down'}/>
                        </Typography>
                    </IconButton>
                </Fade>
            </div>

            <div style={{
                padding: theme.spacing(1.5) + 'px ' + theme.spacing(1) + 'px',
                flexGrow: 1,
                display: 'flex',
                position: 'relative',
            }}>
                <div style={{marginTop: 'auto', width: '100%'}}>
                    <PluginStack schema={schema} parentSchema={parentSchema} storeKeys={storeKeys}/>
                </div>
            </div>

            <div style={{
                padding: theme.spacing(1) + 'px ' + theme.spacing(1.5) + 'px ' + theme.spacing(1) + 'px ' + theme.spacing(1) + 'px',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <IconButton
                    color={'inherit'}
                    size={'medium'}
                    style={{
                        marginLeft: 'auto',
                        marginTop: 0,
                        marginBottom: theme.spacing(0.5),
                        padding: 2,
                        fontSize: '1.25rem',
                    }}
                    onFocusVisible={e => {
                        e.stopPropagation()
                    }}
                    onClick={(e) => {
                        e.stopPropagation()
                        setShowInfo(true)
                    }}
                >
                    {/* @ts-ignore */}
                    <AccessTooltipIcon title={<Trans text={'labels.dnd-show-block-info'}/>}>
                        <IcInfo fontSize={'inherit'}/>
                    </AccessTooltipIcon>
                </IconButton>
                <IconButton
                    color={'inherit'}
                    size={'medium'}
                    style={{
                        marginLeft: 'auto',
                        marginTop: 0,
                        marginBottom: 'auto',
                        padding: 2,
                        fontSize: '1.25rem',
                    }}
                    onFocusVisible={e => {
                        e.stopPropagation()
                    }}
                    onClick={(e) => {
                        e.stopPropagation()
                        if (deleteConfirm) {
                            handleBlockDelete(storeKeys)
                        } else {
                            setDeleteConfirm(true)
                            window.clearTimeout(timer.current)
                            timer.current = window.setTimeout(() => {
                                setDeleteConfirm(false)
                            }, 2500)
                        }
                    }}
                >
                    {/* @ts-ignore */}
                    <AccessTooltipIcon title={deleteConfirm ? <Trans text={'labels.delete-confirm'}/> : <Trans text={'labels.delete'}/>}>
                        {deleteConfirm ? <IcDelete fontSize={'inherit'}/> : <IcDeleteOutline fontSize={'inherit'}/>}
                    </AccessTooltipIcon>
                </IconButton>
            </div>

            {storeKeys.last() < blocksSize - 1 ? <BlockAddHover
                setAddSelectionIndex={setAddSelectionIndex}
                showAddSelection={false}
                index={(storeKeys.last() as number) + 1}
                nameOfBlock={parentSchema.getIn(['dragDrop', 'nameOfBlock']) as string[] | undefined}
            /> : null}

            <Dialog onClose={() => setShowInfo(false)} open={showInfo}>
                <DialogTitle>Block Info</DialogTitle>
                <DialogContent>
                    $block: {blockId}
                </DialogContent>
            </Dialog>
        </div>
    </Grow>
}

// @ts-ignore
BlockPanel = memo(BlockPanel)
export { BlockPanel }
