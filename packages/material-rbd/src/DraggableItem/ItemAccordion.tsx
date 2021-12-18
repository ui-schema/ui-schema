import React from 'react'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useUID } from 'react-uid'
import { useTheme } from '@material-ui/core'
import IcDelete from '@material-ui/icons/Delete'
import IcAdd from '@material-ui/icons/AddCircle'
import IcDeleteOutline from '@material-ui/icons/DeleteOutline'
import IcArrowUpward from '@material-ui/icons/ArrowUpward'
import IcArrowDownward from '@material-ui/icons/ArrowDownward'
import IconButton from '@material-ui/core/IconButton'
import Fade from '@material-ui/core/Fade'
import Grow from '@material-ui/core/Grow'
import { memo, OwnKey, StoreKeys, TransTitle, useUIApi } from '@ui-schema/ui-schema'
import { List } from 'immutable'
import { AccessTooltipIcon } from '@ui-schema/ds-material/Component/Tooltip/Tooltip'
import { useDragDropContext } from '@ui-schema/material-rbd/DragDropProvider/useDragDropContext'
import { EditorSelectionDialog } from '@ui-schema/material-rbd/ItemSelection/EditorSelectionDialog'
import { DragDropItemWrapperProps, DragDropItemWrapperType } from '@ui-schema/material-rbd/DraggableItem/DraggableItem'

const ItemAccordionHoverAction = (
    {setShowAddSelection, showAddSelection}:
        { setShowAddSelection: (open: boolean) => void, showAddSelection: boolean }
) => {
    const [showAdd, setShowAdd] = React.useState(false)
    return <div
        style={{
            position: 'absolute', zIndex: 1, height: 6,
            bottom: '0', left: '15%', right: '15%',
        }}
        onMouseEnter={() => setShowAdd(true)}
        onBlur={() => setShowAdd(false)}
        onMouseLeave={() => setShowAdd(false)}
        tabIndex={0}
        onFocus={e => {
            e.stopPropagation()
            setShowAdd(true)
        }}
        onClick={(e) => {
            e.stopPropagation()
            setShowAddSelection(true)
            setShowAdd(false)
        }}
        onKeyPress={e => {
            e.stopPropagation()
            if (e.key === 'Enter') {
                setShowAddSelection(true)
                setShowAdd(false)
            }
        }}
        aria-label={showAddSelection ? 'Close Selection' : 'Add New Block'}
    >
        <Fade in={showAdd}>
            <IconButton
                color={'inherit'}
                size={'medium'}
                tabIndex={-1}
                style={{
                    position: 'absolute', zIndex: 1,
                    bottom: '-0.5em',
                    left: '50%', right: '50%',
                    padding: 2, fontSize: '1.25rem',
                }}
            >
                {showAddSelection ? null :
                    <AccessTooltipIcon title={showAddSelection ? 'Close Selection' : 'Add New Block'}>
                        <IcAdd fontSize={'inherit'}/>
                    </AccessTooltipIcon>}
            </IconButton>
        </Fade>
    </div>
}

let ItemAccordionSummary = (
    {
        dragHandleProps, schema,
        setShowAddSelection, showAddSelection,
        index, parentKey, storeKeys,
        canMoveDown, title, type,
        description,
    }: {
        dragHandleProps: DragDropItemWrapperProps['dragHandleProps']
        schema: DragDropItemWrapperProps['schema']
        setShowAddSelection: (open: boolean) => void
        showAddSelection: boolean
        canMoveDown: boolean
        title: string
        type?: string
        index: number
        // e.g. the `$block` as fallback label
        parentKey?: OwnKey
        storeKeys: StoreKeys
        description: string | undefined
    }
) => {
    const timer = React.useRef<number | undefined>()
    React.useEffect(() => {
        return () => window.clearTimeout(timer.current)
    }, [timer])
    const uid = useUID()
    const {handleItemDelete, handleDragEnd} = useDragDropContext()
    const [deleteConfirm, setDeleteConfirm] = React.useState(false)
    return <AccordionSummary
        expandIcon={<ExpandMoreIcon/>}
        aria-controls={'uis-' + uid + '-content'}
        id={'uis-' + uid + '-header'}
        {...dragHandleProps}
        style={{display: 'flex', position: 'static'}}
    >
        <div style={{
            marginRight: 8,
            marginTop: -8,
            marginBottom: -8,
            marginLeft: -8,
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Fade in={index > 0}>
                <IconButton
                    color={'inherit'}
                    size={'medium'}
                    style={{
                        padding: 2,
                        fontSize: '.9rem',
                        marginBottom: 'auto',
                    }}
                    onFocusVisible={e => {
                        e.stopPropagation()
                    }}
                    onClick={(e) => {
                        e.stopPropagation()
                        handleDragEnd({
                            destination: {droppableId: String(parentKey || type), index: index - 1},
                            source: {droppableId: String(parentKey || type), index: index},
                            type,
                        })
                    }}
                    // need to use `title` here,
                    // as after moving ab item `AccessTooltipIcon` is sometimes still open
                    title={'Move Up'}
                >
                    <IcArrowUpward fontSize={'inherit'}/>
                </IconButton>
            </Fade>
            <Fade in={canMoveDown}>
                <IconButton
                    color={'inherit'}
                    size={'medium'}
                    style={{
                        padding: 2,
                        fontSize: '.9rem',
                        marginTop: 'auto',
                    }}
                    onFocusVisible={e => {
                        e.stopPropagation()
                    }}
                    onClick={(e) => {
                        e.stopPropagation()
                        handleDragEnd({
                            destination: {droppableId: String(parentKey || type), index: index + 1},
                            source: {droppableId: String(parentKey || type), index: index},
                            type,
                        })
                    }}
                    // need to use `title` here,
                    // as after moving ab item `AccessTooltipIcon` is sometimes still open
                    title={'Move Down'}
                >
                    <IcArrowDownward fontSize={'inherit'}/>
                </IconButton>
            </Fade>
        </div>
        <Typography style={{
            fontWeight: 'bold',
            marginTop: description && window.innerWidth < 960 ? -8 : undefined,
            marginBottom: description && window.innerWidth < 960 ? -2 : undefined,
        }}>
            <TransTitle
                schema={schema} storeKeys={storeKeys}
                // todo: check what is better here, title vs ownKey
                ownKey={title || storeKeys.last()}
            />
            {description && <Typography
                component={'span'}
                style={{
                    display: window.innerWidth < 960 ? 'block' : 'inline-block',
                    lineHeight: window.innerWidth < 960 ? 0.7 : undefined,
                    marginLeft: window.innerWidth < 960 ? 0 : 8,
                    fontWeight: 'normal',
                }}
                variant={window.innerWidth < 960 ? 'body2' : 'body1'}
            >
                {description.length > 40 ? description.slice(0, 40) + '...' : description}
            </Typography>}
        </Typography>
        <IconButton
            color={'inherit'}
            size={'medium'}
            style={{
                marginLeft: 'auto',
                marginTop: 'auto',
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
                    handleItemDelete(storeKeys)
                } else {
                    setDeleteConfirm(true)
                    window.clearTimeout(timer.current)
                    timer.current = window.setTimeout(() => {
                        setDeleteConfirm(false)
                    }, 2500)
                }
            }}
        >
            <AccessTooltipIcon title={deleteConfirm ? 'Confirm Delete' : 'Delete'}>
                {deleteConfirm ? <IcDelete fontSize={'inherit'}/> : <IcDeleteOutline fontSize={'inherit'}/>}
            </AccessTooltipIcon>
        </IconButton>

        <ItemAccordionHoverAction
            setShowAddSelection={setShowAddSelection}
            showAddSelection={showAddSelection}
        />
    </AccordionSummary>
}

// @ts-ignore
ItemAccordionSummary = memo(ItemAccordionSummary)

export const ItemAccordion: DragDropItemWrapperType = (
    {
        children, dragHandleProps,
        schema,
        parentKey, type, storeKeys, index,
        itemsSize,
        data, isDropAnimating, isDragging,
        open,
    }
) => {
    const [expanded, setExpanded] = React.useState<boolean>(Boolean(open))
    const [showAddSelection, setShowAddSelection] = React.useState(false)
    const {schemas} = useUIApi()
    const {palette} = useTheme()
    React.useEffect(() => {
        setExpanded(Boolean(open))
    }, [open])
    // @ts-ignore
    const refDesc = schema?.get('$ref') && schemas?.get(schema?.get('$ref') as string)?.get('$refDesc') as List<string> | undefined

    return <>
        <Grow in><Accordion
            style={{
                borderBottom: '1px solid ' + ((itemsSize - 1) === index || (isDragging && !isDropAnimating) ? palette.background.paper : palette.background.default),
                transition: '0.3s ease-out borderBottom',
                position: 'relative',
            }}
            elevation={isDragging && !isDropAnimating ? 4 : 0}
            expanded={expanded}
            onChange={() => setExpanded(e => !e)}
        >
            <ItemAccordionSummary
                dragHandleProps={dragHandleProps}
                schema={schema}
                setShowAddSelection={setShowAddSelection}
                showAddSelection={showAddSelection}
                parentKey={parentKey}
                storeKeys={storeKeys}
                index={index}
                type={type}
                canMoveDown={itemsSize - 1 > index}
                title={data.get('$block') as string}
                description={
                    refDesc ? data.getIn(refDesc) as string | undefined : undefined
                }
            />
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion></Grow>
        {showAddSelection ? <EditorSelectionDialog
            handleClose={() => {
                setShowAddSelection(false)
            }}
            open={showAddSelection}
            storeKeys={storeKeys.splice(storeKeys.size - 1, 1, index + 1) as StoreKeys}
        /> : null}
    </>
}
