import React from 'react'
import { checkIsOtherTarget } from '@ui-schema/kit-dnd/Utils/checkIsOtherTarget'
import { OnMovedEvent } from '@ui-schema/kit-dnd/Draggable'
import { calcIntentPos, CalcDragIntentEvent, CalcDragIntentOptions } from '@ui-schema/kit-dnd/calcIntentPos'
import { DndDragIntentKeys, DndDragIntentPos, ItemSpec } from '@ui-schema/kit-dnd/KitDnd'
import { calcIntentDataKeys } from '@ui-schema/kit-dnd/calcIntentDataKeys'
import { List } from 'immutable'

export type OnIntentOptions = CalcDragIntentOptions

export type onIntentFactory<C extends HTMLElement = HTMLElement,
    S extends ItemSpec = ItemSpec,
    ID extends string = string,
    E extends OnMovedEvent<C, S, ID> = OnMovedEvent<C, S, ID>>
    = (
    cb: (
        details: E,
        intent: DndDragIntentPos | undefined,
        intentKeys: DndDragIntentKeys | undefined,
        done: (keys?: List<number>, index?: number) => void
    ) => void
) => (details: E) => void

export const useOnIntent = <C extends HTMLElement = HTMLElement>(
    {
        cols, edgeSize,
    }: OnIntentOptions = {}
) => {
    const initialHoverClientOffset = React.useRef<{ x: number, y: number } | undefined>()
    const onIntent: onIntentFactory<C> = React.useCallback((cb) => {
        return (details) => {
            const {
                toDataKeys, toIndex,
                monitor, targetElement,
                item,
            } = details

            const clientOffset = monitor.getClientOffset()
            if (!initialHoverClientOffset.current) {
                initialHoverClientOffset.current = {
                    x: clientOffset?.x || 0,
                    y: clientOffset?.y || 0,
                }
            }
            if (!checkIsOtherTarget({
                toIndex,
                toDataKeys,
                fromIndex: item.index,
                fromDataKeys: item.dataKeys,
            })) {
                initialHoverClientOffset.current = {
                    x: clientOffset?.x || 0,
                    y: clientOffset?.y || 0,
                }
                return
            }

            const initialClientOffset = initialHoverClientOffset.current
            const boundingClientRect = targetElement?.getBoundingClientRect()
            const intentNumbers: CalcDragIntentEvent = {
                initialClientX: initialClientOffset?.x || -1,
                initialClientY: initialClientOffset?.y || -1,
                clientX: clientOffset?.x || -1,
                clientY: clientOffset?.y || -1,
                targetHeight: boundingClientRect?.height || -1,
                targetWidth: boundingClientRect?.width || -1,
                targetX: boundingClientRect?.x || -1,
                targetY: boundingClientRect?.y || -1,
            }

            const intent = calcIntentPos(intentNumbers, {cols, edgeSize})
            const intentKeys = calcIntentDataKeys({
                toIndex, toDataKeys,
                fromDataKeys: item.dataKeys,
                fromIndex: item.index,
            })
            const done = (keys?: List<number>, ix?: number) => {
                initialHoverClientOffset.current = {
                    x: clientOffset?.x || 0,
                    y: clientOffset?.y || 0,
                }

                // Note: we're mutating the monitor item here!
                // Generally it's better to avoid mutations,
                // but it's good here for the sake of performance
                // to avoid expensive index searches.
                //
                // must be done before `onChange`, otherwise it
                // updates the item after `collect`, thus wrong values at that moment
                item.dataKeys = typeof keys === 'undefined' ? toDataKeys : keys
                item.index = typeof keys === 'undefined' ? toIndex : typeof ix === 'number' ? ix : toIndex
            }

            cb(details, intent, intentKeys, done)
        }
    }, [cols, edgeSize])

    return {onIntent}
}
