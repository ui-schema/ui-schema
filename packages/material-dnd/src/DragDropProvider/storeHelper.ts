import {
    // @ts-ignore
    isImmutable,
    List, Map, OrderedMap,
} from 'immutable'
import { genId } from '@ui-schema/material-dnd/genId'
import { addNestKey, onChangeHandler, StoreKeys } from '@ui-schema/ui-schema/UIStore'
import { DropTargetMonitor, XYCoord } from 'react-dnd'
import { DragDropAdvancedContextType } from '@ui-schema/material-dnd/DragDropProvider/useDragDropContext'
import { DraggableBlock } from '@ui-schema/material-dnd/DraggableBlock/DraggableBlock'

export const getNewBlockFromId = (id: string): OrderedMap<'$bid' | '$block', string> => OrderedMap({
    // bid = block-unique-id
    $bid: genId(12),
    $block: id,
}) as OrderedMap<'$bid' | '$block', string>

export const handleMoveUp = (onChange: onChangeHandler, storeKeys: StoreKeys): void => {
    const ownKey = storeKeys.last() as number
    if ((ownKey - 1) < 0) {
        return
    }
    onChange(
        storeKeys.splice(storeKeys.size - 1, 1) as StoreKeys,
        ['value', 'internal'],
        // todo: move `schema`/`required` to action like `type: update`
        {
            type: 'list-item-move',
            fromIndex: ownKey,
            toIndex: ownKey - 1,
        }
    )
}

export const handleMoveDown = (onChange: onChangeHandler, storeKeys: StoreKeys): void => {
    onChange(
        storeKeys.splice(storeKeys.size - 1, 1) as StoreKeys,
        ['value', 'internal'],
        // todo: move `schema`/`required` to action like `type: update`
        {
            type: 'list-item-move',
            fromIndex: storeKeys.last() as number,
            toIndex: storeKeys.last() as number + 1,
        }
    )
}

export const handleDragEnd = (
    ref: React.RefObject<HTMLDivElement>,
    onChange: onChangeHandler,
    item: DraggableBlock,
    storeKeysTo: StoreKeys,
    monitor: DropTargetMonitor,
    getSourceValues: DragDropAdvancedContextType['getSourceValues'],
    moveDraggedValue: DragDropAdvancedContextType['moveDraggedValue'],
    isEmptyPlaceholder?: boolean
): StoreKeys | undefined => {
    if (!ref.current) {
        return
    }

    const storeKeysFrom = item.storeKeys
    // Don't replace blocks with themselves
    if (storeKeysFrom.equals(storeKeysTo)) {
        return
    }

    // Determine rectangle on screen
    const hoverBoundingRect = ref.current?.getBoundingClientRect()

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
    const hoverQuarterY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 4

    // Determine mouse position
    const clientOffset = monitor.getClientOffset()

    // Get pixels to the top
    const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

    let targetKeys = storeKeysTo

    const indexFrom = storeKeysFrom.last() as number
    const indexTo = storeKeysTo.last() as number
    const rootKeysFrom = storeKeysFrom.splice(storeKeysFrom.size - 1, 1) as StoreKeys
    const rootKeysTo = storeKeysTo.splice(storeKeysTo.size - 1, 1)
    const isSameDirectRoot = rootKeysFrom.equals(rootKeysTo)

    // todo: how should onChange handle "batch updates" to correctly handle "deleteOnEmpty"
    if (storeKeysFrom.size < storeKeysTo.size) {
        // drag from a not-so-deep nested level, to a deeper nested level
        const masterKeysTo = storeKeysTo.splice(storeKeysFrom.size, storeKeysTo.size - storeKeysFrom.size) as StoreKeys
        if (
            masterKeysTo.splice(masterKeysTo.size - 1, 1)
                .equals(storeKeysFrom.splice(storeKeysFrom.size - 1, 1))
        ) {
            if (masterKeysTo.last() === storeKeysFrom.last()) {
                // the root item is actually the drag parent of the nested one
                // can not be dragged like this
                return
            } else if (masterKeysTo.last<number>() > (storeKeysFrom.last() as number)) {
                // the dragged item is before the root item of the nested one
                // dragging downwards
                if (hoverClientY < hoverQuarterY) {
                    return
                }
                targetKeys = storeKeysTo.splice(masterKeysTo.size - 1, 1, (masterKeysTo.last() as number) - 1) as StoreKeys
            } else if (masterKeysTo.last<number>() < (storeKeysFrom.last() as number)) {
                // the dragged item is after the root item of the nested one
                // dragging upwards
                if (hoverClientY > (hoverQuarterY * 3)) {
                    return
                }

                if (!isEmptyPlaceholder || storeKeysTo.last<number>() > 0) {
                    // move to position after the drop target, but only if it isn't the "empty list" placeholder
                    targetKeys = storeKeysTo.splice(storeKeysTo.size - 1, 1, (storeKeysTo.last() as number) + 1) as StoreKeys
                }
            }
        }
    } else if (storeKeysFrom.size > storeKeysTo.size) {
        // drag from a nested level, to a not-so-deep nested level
        const masterKeysFrom = storeKeysFrom.splice(storeKeysTo.size, storeKeysFrom.size - storeKeysTo.size)
        if (
            masterKeysFrom.splice(masterKeysFrom.size - 1, 1)
                .equals(storeKeysTo.splice(storeKeysTo.size - 1, 1))
        ) {
            if (masterKeysFrom.last() === storeKeysTo.last()) {
                const isDraggingAfter = hoverClientY > ((hoverBoundingRect.bottom - hoverBoundingRect.top) - 5)
                if (!isDraggingAfter && hoverClientY > 5) {
                    // do not replace the same element
                    //      when the item it not dragged to the last 5px in the parent
                    // and  when not dragged to the top last 5px in it
                    return
                }
                if (isDraggingAfter) {
                    targetKeys = storeKeysTo.splice(storeKeysTo.size - 1, 1, (storeKeysTo.last() as number) + 1) as StoreKeys
                }
            } else if ((masterKeysFrom.last() as number) > storeKeysTo.last<number>()) {
                // the dragged item was after the root item of the nested one
                // dragging upwards
                if (hoverClientY > hoverQuarterY) {
                    return
                }
            } else if ((masterKeysFrom.last() as number) < storeKeysTo.last<number>()) {
                // the dragged item was before the root item of the nested one
                // dragging downwards
                if (hoverClientY < hoverQuarterY) {
                    return
                }
            }
        }
    } else {
        // drag from another root level into another one with the same nested depth (e.g. two parallel roots)
        // or drag within the same root level
        if (
            (!isSameDirectRoot || (isSameDirectRoot && indexFrom < indexTo)) &&
            hoverClientY > hoverMiddleY
        ) {
            // in lower half of any entry
            // when in same root, dragging upwards
            if (!isSameDirectRoot && (!isEmptyPlaceholder || storeKeysTo.last<number>() > 0)) {
                // move to position after the drop target, but only if it isn't the "empty list" placeholder
                targetKeys = storeKeysTo.splice(storeKeysTo.size - 1, 1, (storeKeysTo.last() as number) + 1) as StoreKeys
            }
        } else if (
            (!isSameDirectRoot || (isSameDirectRoot && indexFrom > indexTo)) &&
            hoverClientY < hoverMiddleY
        ) {
            // in upper half of any entry
            // when in same root, dragging upwards
        } else {
            return
        }
    }

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    //
    // must be done before `onChange`, otherwise it
    // updates the item after `collect`, thus wrong storeKeys at that moment
    item.storeKeys = targetKeys

    onChange(
        List(),
        ['value', 'internal'],
        // todo: move `schema`/`required` to action like `type: update`
        ({value, internal = Map()}) => {
            if (storeKeysFrom.size < 2) {
                // when in root list (single root array for whole schema)
                if (typeof value === 'undefined') {
                    value = List()
                }
            }
            const sourceValues = getSourceValues(item, storeKeysFrom, value, internal)
            if (typeof sourceValues.value === 'undefined') {
                // todo: remove this "cancel-drags-from-totally-other-root" with correct `canDrop` for independent UIGenerators
                console.error(
                    'DND try to drag ' + (typeof value.getIn(storeKeysFrom) === 'undefined' ? 'not ' : '') + 'existing block to a list that is ' + (isImmutable(value) ? 'no' : '') + ' immutable, see value and storeKeysFrom and storeKeysTo:',
                    isImmutable(value) ? value.toJS() : value,
                    storeKeysFrom.toJS(),
                    storeKeysTo.toJS()
                )
                return {
                    value: value,
                }
            }

            return {
                value: moveDraggedValue(item, value, sourceValues.value, rootKeysFrom, indexFrom, targetKeys),
                internal: moveDraggedValue(
                    item, internal, sourceValues.internal,
                    addNestKey('internals', rootKeysFrom).push('internals'),
                    indexFrom,
                    addNestKey('internals', targetKeys.splice(-1, 1) as StoreKeys).push('internals').push(targetKeys.last())
                ),
            }
        }
    )
}
