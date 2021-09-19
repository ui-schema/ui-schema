import React from 'react'
import { prependKey, StoreKeys, StoreSchemaType, useUI } from '@ui-schema/ui-schema'
import { EditorSelectionDialog } from '@ui-schema/material-dnd/BlockSelection/BlockSelectionDialog'
import { DraggableBlockProps } from '@ui-schema/material-dnd/DraggableBlock/DraggableBlock'
import { DragDropBlockList, DragDropAdvancedContextType } from '@ui-schema/material-dnd/DragDropProvider/useDragDropContext'
import { BlockAddHover } from '@ui-schema/material-dnd/BlockSelection/BlockAddHover'
import { makeStyles } from '@material-ui/core/styles'
import { DroppableRootSelect } from '@ui-schema/material-dnd/DroppableRoot/DroppableRootSelect'
import { BlockAddProps } from '@ui-schema/material-dnd/BlockSelection/BlockAddProps'
import { List } from 'immutable'

export interface DroppableRootContentProps {
    storeKeys: StoreKeys
    schema: StoreSchemaType
    type?: string
    openAll?: boolean
    blocks: DragDropAdvancedContextType['blocks']
    moveDraggedValue: DragDropAdvancedContextType['moveDraggedValue']
    getSourceValues: DragDropAdvancedContextType['getSourceValues']
    handleBlockAdd: DragDropAdvancedContextType['handleBlockAdd']
    handleBlockDelete: DragDropAdvancedContextType['handleBlockDelete']
    ComponentBlock: React.ComponentType<DraggableBlockProps>
}

let ContentTools = (
    {
        addSelectionIndex, setAddSelectionIndex,
        dataSize, blocks, handleBlockAdd,
        storeKeys, schema,
    }:
        {
            addSelectionIndex: number
            setAddSelectionIndex: BlockAddProps['setAddSelectionIndex']
            dataSize: number
            blocks: DragDropAdvancedContextType['blocks']
            handleBlockAdd: DragDropAdvancedContextType['handleBlockAdd']
            storeKeys: StoreKeys
            schema: StoreSchemaType
        }
) => {
    const allowed = schema.getIn(['dragDrop', 'allowed']) as List<string>

    const availableBlocks = allowed ?
        blocks.filter((_i, k) => allowed.contains(k)) as DragDropAdvancedContextType['blocks'] :
        blocks

    React.useEffect(() => {
        if (addSelectionIndex !== -1) {
            if (availableBlocks.keySeq().size === 1) {
                handleBlockAdd(availableBlocks.keySeq().get(0) as string, storeKeys.push(addSelectionIndex))
                setAddSelectionIndex(-1)
            }
        }
    }, [availableBlocks, storeKeys, addSelectionIndex, handleBlockAdd, setAddSelectionIndex])

    return <>
        {dataSize ? <BlockAddHover
            setAddSelectionIndex={setAddSelectionIndex}
            showAddSelection={addSelectionIndex !== -1}
            index={dataSize}
            nameOfBlock={schema.getIn(['dragDrop', 'nameOfBlock']) as string[] | undefined}
            asBlock
            forceShow
        /> : null}

        {addSelectionIndex !== -1 ?
            <EditorSelectionDialog
                handleClose={() => {
                    setAddSelectionIndex(-1)
                }}
                open={addSelectionIndex !== -1}
                storeKeys={storeKeys.push(addSelectionIndex)}
                blocks={availableBlocks}
                handleBlockAdd={handleBlockAdd}
            /> : null}
    </>
}

// @ts-ignore
ContentTools = React.memo(ContentTools)

const useStyle = makeStyles(({palette}) => ({
    dropZone: {
        minHeight: 45,
        background: palette.background.paper,
        transition: '0.3s ease-out background-color',
        position: 'relative',
    },
}))

export const DroppableRootContent: React.ComponentType<DroppableRootContentProps> = (
    {
        type, storeKeys, schema,
        openAll,
        blocks, handleBlockAdd, handleBlockDelete,
        getSourceValues, moveDraggedValue,
        ComponentBlock,
    }
) => {
    const classes = useStyle()
    const {store, onChange} = useUI()
    const data: DragDropBlockList | undefined = store?.getIn(storeKeys.size > 0 ? prependKey(storeKeys, 'values') : ['values']) as any
    const [addSelectionIndex, setAddSelectionIndex] = React.useState<number>(-1)
    const blockIdSelector = '$bid'
    const blocksSelector = '$block'

    return <div className={classes.dropZone}>
        <div style={{display: data?.size ? 'none' : 'block'}}>
            <DroppableRootSelect
                setAddSelectionIndex={setAddSelectionIndex}
                moveDraggedValue={moveDraggedValue}
                getSourceValues={getSourceValues}
                schema={schema}
                storeKeys={storeKeys.push(0)}
                onChange={onChange}
            />
        </div>

        {data?.size ?
            data.toArray().map((item, i) =>
                <ComponentBlock
                    key={(item.get(blockIdSelector) as string) || i}
                    type={type}
                    parentKeys={storeKeys}
                    storeKeys={storeKeys.push(i) as StoreKeys}
                    ownKey={i}
                    blockId={item.get(blocksSelector) as string}
                    blocksSize={data.size}
                    parentSchema={schema}
                    schema={blocks.get(item.get(blocksSelector) as string) as StoreSchemaType}
                    handleBlockDelete={handleBlockDelete}
                    moveDraggedValue={moveDraggedValue}
                    getSourceValues={getSourceValues}
                    open={openAll}
                    onChange={onChange}
                    setAddSelectionIndex={setAddSelectionIndex}
                />
            ) : null}

        <ContentTools
            addSelectionIndex={addSelectionIndex}
            setAddSelectionIndex={setAddSelectionIndex}
            dataSize={data?.size || 0}
            schema={schema}
            blocks={blocks}
            handleBlockAdd={handleBlockAdd}
            storeKeys={storeKeys}
        />
    </div>
}
