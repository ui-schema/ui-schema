import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { beautifyKey, memo, OwnKey, StoreKeys, StoreSchemaType, Trans, useRefs, useUI } from '@ui-schema/ui-schema'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import IcUnfoldMore from '@material-ui/icons/UnfoldMore'
import IcUnfoldLess from '@material-ui/icons/UnfoldLess'
import IconButton from '@material-ui/core/IconButton'
import Fade from '@material-ui/core/Fade'
import IcAdd from '@material-ui/icons/AddCircle'
import { AccessTooltipIcon } from '@ui-schema/ds-material/Component/Tooltip/Tooltip'
import { EditorSelectionDialog } from '@ui-schema/material-rbd/ItemSelection/EditorSelectionDialog'
import { DragDropItemList } from '@ui-schema/material-rbd/DragDropProvider/useDragDropContext'
import { DraggableItem } from '@ui-schema/material-rbd/DraggableItem/DraggableItem'
import { ItemAccordion } from '@ui-schema/material-rbd/DraggableItem/ItemAccordion'
import { List, Map } from 'immutable'
import { prependKey } from '@ui-schema/ui-schema/UIStore/UIStore'

const useStyle = makeStyles(({palette}) => ({
    dropZone: {
        minHeight: 45,
        //border: '1px solid #8e8e8e',
        //background: snapshot.isDraggingOver ? palette.background.paper : palette.background.default,
        background: palette.background.paper,
        transition: '0.3s ease-out background-color',
        //overflow: 'hidden',
        position: 'relative',
    },
}))

export interface DroppableRootContentProps {
    storeKeys: StoreKeys
    schema: StoreSchemaType
    type?: string
    ownKey?: string | number
    isDraggingOver: boolean
    openAll: boolean | undefined
}

const EditorRootSelect = ({storeKeys, isDraggingOver}: { storeKeys: StoreKeys, isDraggingOver: boolean }) => {
    const [showAddSelection, setShowAddSelection] = React.useState(false)
    return <>
        {showAddSelection ? null :
            <Typography
                variant={'subtitle2'} component={'button'}
                align={'center'} color={'textSecondary'}
                style={{
                    position: 'absolute', width: '100%', height: '100%',
                    opacity: isDraggingOver ? 0.4 : 0.8,
                    top: 0, right: 0, bottom: 0, left: 0,
                    border: 0, background: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                onClick={() => setShowAddSelection(true)}
            >
                <span>
                    <AccessTooltipIcon title={showAddSelection ? 'Close Selection' : 'Add New Block'}>
                        <IcAdd fontSize={'inherit'} style={{verticalAlign: 'text-top'}}/>
                    </AccessTooltipIcon>{' '}
                    <span style={{paddingLeft: 2}}>Add a block!</span>
                </span>
            </Typography>}
        {showAddSelection ? <EditorSelectionDialog
            handleClose={() => {
                setShowAddSelection(false)
            }}
            open={showAddSelection}
            storeKeys={storeKeys.push(0)}
        /> : null}
    </>
}

// @ts-ignore
const DroppableRootContent: React.ComponentType<DroppableRootContentProps> = ({type, schema, storeKeys, isDraggingOver, openAll, ownKey}) => {
    const {store} = useUI()
    const {definitions} = useRefs()
    const data: DragDropItemList = store.getIn(storeKeys.size > 0 ? prependKey(storeKeys, 'values') : ['values'])
    return data && data.size ?
        data.toArray().map((item, i) =>
            <DraggableItem
                key={item.get('$bid') as string}
                index={i}
                itemsSize={data.size}
                type={type}
                parentKeys={storeKeys}
                storeKeys={storeKeys.push(i) as StoreKeys}
                parentKey={ownKey}
                data={item}
                schema={
                    // todo: get item schema from DragDropContext
                    definitions?.getIn([item.get('$block')])
                }
                parentSchema={schema}
                open={openAll}
                Wrapper={ItemAccordion}
            />) :
        <EditorRootSelect storeKeys={storeKeys} isDraggingOver={isDraggingOver}/>
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
let DroppableRoot = (
    {schema, storeKeys, ownKey, hasItems, type}:
        { schema: StoreSchemaType, storeKeys: StoreKeys, ownKey?: OwnKey, hasItems: boolean, type?: string }
) => {
    const classes = useStyle()
    const [openAll, setOpenAll] = React.useState<boolean>(false)

    return <Droppable
        droppableId={String(ownKey || type)}
        type={type}
        ignoreContainerClipping
    >
        {(provided, snapshot) => (
            <div>
                <h4 style={{display: 'flex'}}>
                    <span style={{margin: 'auto 4px auto 0'}}>
                        <Trans
                            schema={schema.get('t') as StoreSchemaType}
                            text={(schema.get('title') || storeKeys.insert(0, 'widget').push('title').join('.')) as string}
                            context={Map({'relative': List(['title'])})}
                            fallback={schema.get('title') as string || (ownKey ? beautifyKey(ownKey, schema.get('tt') as any) : '')}
                        />
                    </span>
                    <Fade in={hasItems}>
                        <IconButton
                            style={{
                                margin: 'auto 12px auto auto',
                                padding: 4,
                            }}
                            onClick={() => setOpenAll(o => !o)}
                        >
                            <AccessTooltipIcon title={openAll ? 'Close All' : 'Open All'}>
                                {openAll ? <IcUnfoldLess fontSize={'inherit'} color={'inherit'}/> :
                                    <IcUnfoldMore fontSize={'inherit'} color={'inherit'}/>}
                            </AccessTooltipIcon>
                        </IconButton>
                    </Fade>
                </h4>

                <div
                    ref={provided.innerRef}
                    className={classes.dropZone}
                    {...provided.droppableProps}
                >
                    <DroppableRootContent
                        type={type}
                        schema={schema}
                        storeKeys={storeKeys}
                        ownKey={ownKey}
                        isDraggingOver={snapshot.isDraggingOver}
                        openAll={openAll}
                    />
                    {provided.placeholder}
                </div>
            </div>
        )}
    </Droppable>
}

// @ts-ignore
DroppableRoot = memo(DroppableRoot)

export { DroppableRoot }
