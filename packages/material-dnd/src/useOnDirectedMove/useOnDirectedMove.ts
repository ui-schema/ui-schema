import { List, Map } from 'immutable'
import { addNestKey, DndIntents, moveDraggedValue, onIntentFactory, onMovedType } from '@ui-schema/kit-dnd'
import React from 'react'
import { onChangeHandler, StoreKeys } from '@ui-schema/ui-schema'
import { DragDropSpec } from '@ui-schema/material-dnd/DragDropSpec'

export const useOnDirectedMove = <C extends HTMLElement = HTMLElement, S extends DragDropSpec = DragDropSpec>(
    onIntent: onIntentFactory<C, S>,
    onChange: onChangeHandler,
    debug?: boolean,
): {
    onMove: onMovedType<C, S>
} => {
    const lastMergeTag = React.useRef<{
        time: number
        timer: number | undefined
        merge: undefined | string
        id: string | undefined
    }>({time: 0, timer: undefined, merge: undefined, id: undefined})

    const onMove: onMovedType<C, S> = React.useMemo(() => {
        return onIntent((
            {
                fromItem, toItem,
            },
            intent,
            rawIntentKeys,
            done,
        ) => {
            if (!intent || !rawIntentKeys) {
                return
            }
            if (lastMergeTag.current.timer) {
                window.clearTimeout(lastMergeTag.current.timer)
            }
            const {
                type: fromType,
                dataKeys: fromDataKeys,
                index: fromIndex,
                isDroppable: fromIsDroppable,
                listKey: fromListKey,
                id: fromId,
            } = fromItem
            const {
                type: toType,
                index: toIndex,
                dataKeys: toDataKeys,
                id: toId,
                isDroppable: toIsDroppable,
                listKey: toListKey,
            } = toItem

            // todo: refine intentKeys with listKey
            const intentKeys = {
                ...rawIntentKeys,
                isParent: Boolean(rawIntentKeys.isParent || (rawIntentKeys.willBeParent && toListKey && ((fromDataKeys.size - toDataKeys.size) <= 2))),
                ...(toListKey ? {
                    level:
                        fromDataKeys.size === toDataKeys.size ?
                            !fromDataKeys.equals(toDataKeys) ? DndIntents.switch : rawIntentKeys.level
                            : rawIntentKeys.level,
                    container:
                        fromDataKeys.size === toDataKeys.size &&
                        !fromDataKeys.equals(toDataKeys) ? undefined : rawIntentKeys.container,
                } : {}),
            }
            if (
                // todo: add support for `listKey` at e.g. `isParent`/`willBeParent`,
                //       as e.g. a block inside an listKey-area doesn't recognize the area as it's parent and will move wrongly
                // an area can not be dragged deeper into itself:
                (fromIsDroppable && intentKeys.willBeParent && intentKeys.level === 'down')
            ) {
                if (debug) {
                    console.log(' IGNO from  ' + fromType + '  to  ' + toType, intent, intentKeys)
                }
                return
            }
            if (debug) {
                console.log('  from  ' + fromType + '  to  ' + toType, fromId, fromIsDroppable, toIsDroppable, intent, intentKeys)
                console.log('  from  ' + fromType + '  to  ' + toType, toId, fromDataKeys?.toJS(), fromIndex, fromListKey, toDataKeys.toJS(), toIndex, toListKey)
            }

            if (!toIsDroppable) {
                // - BLOCK > BLOCK
                // - AREA  > BLOCK
                if (
                    (
                        intentKeys.level === 'up' ||
                        intentKeys.level === 'same' ||
                        intentKeys.level === 'switch'
                    ) && (intent.edgeX || intent.edgeY)) {
                    return
                }
                let dk = toDataKeys
                if (
                    intentKeys.level === 'down' &&
                    (toDataKeys.size - fromDataKeys.size) >= 1
                ) {
                    if (intentKeys.isParent || intentKeys.willBeParent) {
                        return
                    }
                    // ONLY when moving `down`, from outside the same list
                    if (intentKeys.wasBeforeRelative) {
                        // was before this block in the relative store order
                        // thus the last relative key needs to be decreased
                        dk = dk.update(fromDataKeys.size,
                            (toIndexRelativeFirst) =>
                                typeof toIndexRelativeFirst === 'number' ?
                                    toIndexRelativeFirst - 1 :
                                    toIndexRelativeFirst
                        )
                    }
                }
                // - switching within one array or between different relative roots
                onChange({
                    storeKeys: List() as StoreKeys,
                    scopes: ['value', 'internal'],
                    // todo: move `schema`/`required` to action like `type: update`
                    type: 'update',
                    updater: ({value, internal = Map()}) => {
                        value = moveDraggedValue(
                            value,
                            fromDataKeys, fromIndex,
                            dk, toIndex,
                        )
                        internal = moveDraggedValue(
                            internal,
                            addNestKey<string | number>('internals', fromDataKeys).splice(0, 0, 'internals'), fromIndex,
                            addNestKey<string | number>('internals', dk).splice(0, 0, 'internals'), toIndex,
                        )
                        return {value, internal}
                    },
                })
                done(dk, toIndex)
                return
            }

            if (
                toIsDroppable && (
                    intentKeys.level === 'down' || intentKeys.level === 'up' ||
                    intentKeys.level === 'same' || intentKeys.level === 'switch'
                )
            ) {
                // - any > AREA
                if (
                    (
                        // ignoring dragging to own area, when it's not dragging up and on any edge
                        (intentKeys.isParent && intentKeys.level !== 'up')
                    ) || (
                        // ignoring on y-edges when not dragging up,
                        // to allow adding blocks at the end of an area from within another area in that area
                        intentKeys.level !== 'up' && intent.edgeY
                    ) || (
                        // ignoring x-edges for every action to make it possible to drag in-between nested blocks
                        !fromIsDroppable && intent.edgeX && intentKeys.level !== 'up'
                    )
                ) {
                    return
                }

                const setter = (doMerge: string | undefined) => {
                    onChange({
                        storeKeys: List() as StoreKeys,
                        scopes: ['value', 'internal'],
                        type: 'update',
                        // todo: move `schema`/`required` to action like `type: update`
                        updater: ({value, internal = Map()}) => {
                            let dk = toDataKeys

                            const orgTks = addNestKey<string | number>('list', toDataKeys.push(toIndex))
                            let ti = intent.posQuarter === 'top-left' || intent.posQuarter === 'top-right' ? 0 :
                                ((value.getIn(orgTks) as List<any>)?.size || 0)
                            // when level up, adjust the dataKeys parent according to the new nested index
                            // and either add to `0` or last index
                            if (intentKeys.level === 'same' && intentKeys.container === 'down' && intentKeys.wasBeforeRelative) {
                                dk = dk.push(toIndex - 1 || 0)
                            } else if ((intentKeys.level === 'down' || intentKeys.level === 'switch') && intentKeys.wasBeforeRelative) {
                                // was before this block in the relative store order
                                // thus the last relative key needs to be decreased
                                dk = dk.update(fromDataKeys.size, (toIndexRelativeFirst) => (toIndexRelativeFirst as number) - 1)
                                dk = dk.push(toIndex)
                            } else if (doMerge) {
                                if (doMerge === 'next') {
                                    ti = toIndex + 1
                                } else if (doMerge === 'prev') {
                                    ti = toIndex
                                } else {
                                    throw new Error('merge not implemented: ' + JSON.stringify(doMerge))
                                }
                            } else {
                                dk = dk.push(toIndex)
                            }
                            if (!doMerge) {
                                if (toListKey) {
                                    // add the optional `listKey` of the target,
                                    // only needed for movement which target the actual list, not the draggable root-block,
                                    // e.g. would create invalid target for merges: the list instead of the block
                                    dk = dk.push(toListKey as unknown as number)
                                }
                            }

                            if (debug) {
                                console.log('doMerge,dk,ti,toIndex', doMerge, dk.toJS(), ti, toIndex)
                            }

                            value = moveDraggedValue(
                                value,
                                fromDataKeys, fromIndex,
                                dk, ti,
                            )
                            internal = moveDraggedValue(
                                internal,
                                addNestKey<string | number>('internals', fromDataKeys).splice(0, 0, 'internals'), fromIndex,
                                addNestKey<string | number>('internals', dk).splice(0, 0, 'internals'), ti,
                            )

                            done(dk, ti)
                            return {value, internal}
                        },
                    })
                }

                let doMerge: string | undefined = undefined
                if (intentKeys.level === 'up' && intentKeys.isParent) {
                    // handling AREA > AREA that are not siblings to get siblings
                    if (!intent.edgeY && !intent.edgeX) {
                        // no edges active
                        return
                    }
                    // todo: only respects X-axis or Y-axis flow for blocks, in XY-axis flow it would need to find the related area below it's own area
                    if (intent.edgeX) {
                        if (intent.edgeX === 'right') {
                            // move to right of parent
                            doMerge = 'next'
                        } else if (intent.edgeX === 'left') {
                            // move to left of parent
                            doMerge = 'prev'
                        }
                    } else if (intent.edgeY) {
                        if (intent.edgeY === 'bottom') {
                            // move to bottom of parent
                            doMerge = 'next'
                        } else if (intent.edgeY === 'top') {
                            // move to top of parent
                            doMerge = 'prev'
                        }
                    }
                    if (!doMerge) {
                        return
                    }

                    if (doMerge) {
                        const ts = new Date().getTime()
                        if (
                            lastMergeTag.current.merge !== doMerge ||
                            lastMergeTag.current.id !== toId
                        ) {
                            window.clearTimeout(lastMergeTag.current.timer)
                            lastMergeTag.current.time = ts
                            lastMergeTag.current.merge = doMerge
                            lastMergeTag.current.id = toId
                            return
                        }
                        const sinceLastMerge = (ts - lastMergeTag.current.time)
                        if (sinceLastMerge > 450) {
                            window.clearTimeout(lastMergeTag.current.timer)
                            lastMergeTag.current.time = 0
                            setter(doMerge)
                            return
                        } else if (!lastMergeTag.current.timer) {
                            lastMergeTag.current.timer = window.setTimeout(() => {
                                setter(doMerge)
                            }, 450)
                            return
                        } else {
                            return
                        }
                    } else {
                        return
                    }
                }

                setter(undefined)
                return
            }
        })
    }, [onChange, onIntent, lastMergeTag, debug])

    return {onMove}
}
