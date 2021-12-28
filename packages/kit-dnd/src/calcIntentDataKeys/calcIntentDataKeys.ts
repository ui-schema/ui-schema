import { DndIntents, DndDragIntentKeys, DataKeys } from '@ui-schema/kit-dnd/KitDnd'

/**
 * calculating the result of a drag-move action towards what store changes the keys may need to do
 * ! these intents do not have something to do with the actual user-gesture action, for that use `calcIntentPos`
 * @param toIndex
 * @param toDataKeys
 * @param fromIndex
 * @param fromDataKeys
 */
export const calcIntentDataKeys = (
    {
        toIndex, toDataKeys,
        fromIndex, fromDataKeys,
    }: {
        toIndex: number
        toDataKeys: DataKeys
        fromIndex: number
        fromDataKeys: DataKeys
    }
): DndDragIntentKeys | undefined => {
    if (fromDataKeys.size < toDataKeys.size) {
        // DOWN -> from a not-so-deep nested level, to a deeper nested level

        const toRelativeLeadingKeys = toDataKeys.slice(0, fromDataKeys.size + 1)
        const toIndexRelativeFirst = toRelativeLeadingKeys.last()
        const willBeParent = toRelativeLeadingKeys.equals(fromDataKeys.push(fromIndex))
        const wasBeforeRelative =
            typeof toIndexRelativeFirst === 'number' &&
            toRelativeLeadingKeys.splice(-1, 1).equals(fromDataKeys) &&
            fromIndex < (toIndexRelativeFirst)

        return {
            wasBeforeRelative: wasBeforeRelative,
            willBeParent: willBeParent,
            level: DndIntents.down,
        }
    }
    if (fromDataKeys.size > toDataKeys.size) {
        // UP -> drag from a nested level, to a not-so-deep nested level

        const willBeParent = fromDataKeys.slice(0, (toDataKeys.size || 0) + 1).equals(toDataKeys.push(toIndex))
        const willBeDirectRoot = fromDataKeys.equals(toDataKeys.push(toIndex))
        // the root item is actually the drag parent of the nested one
        // can most likely not be dragged like this
        return {
            // todo: add `listKey` support here, e.g. passing down `2` to here somehow?
            isParent: willBeParent && (fromDataKeys.size - toDataKeys.size) === 1,
            willBeParent,
            willBeDirectRoot,
            level: DndIntents.up,
        }
    }
    const hasSameDirectRoot = fromDataKeys.equals(toDataKeys)
    if (!hasSameDirectRoot) {
        // drag from another root level into another one with the same nested depth (e.g. two parallel roots)
        return {
            level: DndIntents.switch,
        }
    }
    //
    // drag within the same root level
    if (fromIndex === toIndex) {
        // same item
        return undefined
    }
    // when in same root, moving the list item down: was-before-relative
    const wasBeforeRelative = fromIndex < toIndex
    return {
        wasBeforeRelative: wasBeforeRelative,
        level: DndIntents.same,
        container: wasBeforeRelative ? DndIntents.down : DndIntents.up,
    }
}
