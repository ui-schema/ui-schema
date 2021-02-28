import { List, OrderedMap } from 'immutable'
import { genId } from '../genId'
import { StoreSchemaType } from '@ui-schema/ui-schema'
import { DragDropItemDefinition, DragDropItemList, DragDropItemLists } from '@ui-schema/material-rbd/DragDropProvider/useDragDropContext'

export interface NestedObject {
    [key: string]: NestedObject[]
}

// todo: should be done in backend
export const migrateStore = (store: NestedObject): NestedObject => {
    if (typeof store !== 'object' || Array.isArray(store)) {
        console.error('Invalid type `store` for migration', typeof store)
        return store
    }
    const newStore: NestedObject = {}
    Object.keys(store).forEach(key => {
        const root = store[key]
        if (Array.isArray(root)) {
            newStore[key] = root.map(block => {
                if (block._id) {
                    block.$bid = block._id
                    delete block._id
                }
                return block
            })
        }
    })
    return newStore
}

export const getNewBlockFromId = (id: string): OrderedMap<'$bid' | '$block', string> => OrderedMap({
    // bid = block-unique-id
    $bid: genId(),
    $block: id,
}) as OrderedMap<'$bid' | '$block', string>

export const handleDragDropEnd = (
    items: DragDropItemDefinition,
    {srcRootId, srcItemId, destRootId, destItemId, type}:
        { srcRootId: string, srcItemId: number, destRootId: string, destItemId: number, type?: string }
) => (
    prevData: DragDropItemLists | List<any>
): DragDropItemLists | List<any> => {
    if (
        destRootId === srcRootId &&
        destItemId === srcItemId
    ) {
        return prevData
    }

    if (srcRootId.indexOf('ItemSelection__') === 0) {
        // copy and add new, not move for root `ItemSelection__`
        const newBlock = getNewBlockFromId(items.keySeq().get(srcItemId) || 'NotFound')
        if (type === '$single') {
            return (prevData as List<any>).splice(destItemId, 0, newBlock) as List<StoreSchemaType>
        }
        return (prevData as DragDropItemLists).update(
            destRootId,
            (destRoot: DragDropItemList = List()) =>
                destRoot.splice(destItemId, 0, newBlock) as List<StoreSchemaType>
        )
    }

    const srcItem = prevData.getIn(type === '$single' ? [srcItemId] : [srcRootId, srcItemId])

    if (type === '$single') {
        return (prevData as List<any>).splice(srcItemId, 1).splice(destItemId, 0, srcItem) as List<any>
    }

    if (destRootId === srcRootId) {
        return prevData.updateIn([srcRootId], prevSrc =>
            // delete from old pos && add in new pos
            (prevSrc || List()).splice(srcItemId, 1).splice(destItemId, 0, srcItem)
        )
    }

    return (prevData as DragDropItemLists)
        .update(srcRootId, (srcRoot: List<any> = List()) => srcRoot.splice(srcItemId, 1) as List<StoreSchemaType>)
        .update(destRootId, (destRoot: List<any> = List()) => destRoot.splice(destItemId, 0, srcItem) as List<StoreSchemaType>)
}
