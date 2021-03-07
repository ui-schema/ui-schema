import React from 'react'
import { beautifyKey, memo, OwnKey, StoreKeys, StoreSchemaType, Trans } from '@ui-schema/ui-schema'
import { AccessTooltipIcon } from '@ui-schema/ds-material'
import IcUnfoldMore from '@material-ui/icons/UnfoldMore'
import IcUnfoldLess from '@material-ui/icons/UnfoldLess'
import IconButton from '@material-ui/core/IconButton'
import Fade from '@material-ui/core/Fade'
import { List, Map } from 'immutable'
import { DraggableBlockProps } from '@ui-schema/material-dnd/DraggableBlock/DraggableBlock'
import { DroppableRootContentProps } from '@ui-schema/material-dnd/DroppableRoot/DroppableRootContent'
import { DragDropAdvancedContextType } from '@ui-schema/material-dnd/DragDropProvider/useDragDropContext'

export interface DroppableRootProps {
    schema: StoreSchemaType
    storeKeys: StoreKeys
    ownKey?: OwnKey
    type?: string
    blocks: DragDropAdvancedContextType['blocks']
    getSourceValues: DragDropAdvancedContextType['getSourceValues']
    moveDraggedValue: DragDropAdvancedContextType['moveDraggedValue']
    handleBlockAdd: DragDropAdvancedContextType['handleBlockAdd']
    handleBlockDelete: DragDropAdvancedContextType['handleBlockDelete']
    ComponentRootContent: React.ComponentType<DroppableRootContentProps>
    ComponentBlock: React.ComponentType<DraggableBlockProps>
}

let DroppableRoot: React.ComponentType<DroppableRootProps> = (
    {
        schema, storeKeys, ownKey,
        ComponentRootContent,
        ComponentBlock,
        blocks, handleBlockAdd, handleBlockDelete,
        getSourceValues, moveDraggedValue,
    }
) => {
    const [openAll, setOpenAll] = React.useState<boolean>(false)

    return <div>
        <h4 style={{display: 'flex'}}>
            <span style={{margin: 'auto 4px auto 0'}}>
                <Trans
                    schema={schema.get('t') as StoreSchemaType}
                    text={(schema.get('title') || storeKeys.insert(0, 'widget').push('title').join('.')) as string}
                    context={Map({'relative': List(['title'])})}
                    fallback={ownKey ? beautifyKey(ownKey, schema.get('tt') as any) : undefined}
                />
            </span>
            {schema.getIn(['dragDrop', 'showOpenAll']) ?
                <Fade in>
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
                </Fade> : null}
        </h4>

        <ComponentRootContent
            storeKeys={storeKeys}
            openAll={openAll}
            schema={schema}
            blocks={blocks}
            getSourceValues={getSourceValues}
            moveDraggedValue={moveDraggedValue}
            handleBlockAdd={handleBlockAdd}
            handleBlockDelete={handleBlockDelete}
            ComponentBlock={ComponentBlock}
        />
    </div>
}

// @ts-ignore
DroppableRoot = memo(DroppableRoot)

export { DroppableRoot }
