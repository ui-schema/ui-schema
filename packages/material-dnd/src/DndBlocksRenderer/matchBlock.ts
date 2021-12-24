import { DndBlock, DragDropBlockContextType } from '@ui-schema/material-dnd/DragDropBlockProvider'
import { OrderedMap } from 'immutable'

export const matchBlock = (blocks: DragDropBlockContextType['blocks'], val: OrderedMap<string, any>): {
    block: DndBlock
    id: string
} | undefined => {
    let block: DndBlock | undefined
    for (const blockId in blocks) {
        const {idKey, typeKey} = blocks[blockId]
        if (val.has(typeKey) && val.has(idKey) && val.get(typeKey) === blockId) {
            block = blocks[blockId]
            break
        }
    }
    if (!block) return undefined
    return {
        block,
        id: val.get(block.idKey),
    }
}
