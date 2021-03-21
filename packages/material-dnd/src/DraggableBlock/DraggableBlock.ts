import { onChangeHandler, StoreKeys, StoreSchemaType } from '@ui-schema/ui-schema'
import { DragDropAdvancedContextType } from '@ui-schema/material-dnd/DragDropProvider/useDragDropContext'
import { BlockAddProps } from '@ui-schema/material-dnd/BlockSelection/BlockAddProps'

export interface DraggableBlockProps {
    parentKeys: StoreKeys
    storeKeys: StoreKeys
    blockId: string
    blocksSize: number
    schema: StoreSchemaType
    parentSchema: StoreSchemaType
    ownKey: number
    onChange: typeof onChangeHandler
    type?: string
    open?: boolean
    setAddSelectionIndex: BlockAddProps['setAddSelectionIndex']
    getSourceValues: DragDropAdvancedContextType['getSourceValues']
    moveDraggedValue: DragDropAdvancedContextType['moveDraggedValue']
    handleBlockDelete: DragDropAdvancedContextType['handleBlockDelete']
}

export interface DraggableBlock {
    storeKeys: StoreKeys
    type: string
    $block: string
    // todo: maybe using `root` for cross-dragging between independent UIGenerators
    root?: any
}
