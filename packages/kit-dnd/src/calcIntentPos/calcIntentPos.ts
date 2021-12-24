import { DndDragIntentPos, DndIntents } from '@ui-schema/kit-dnd/KitDnd'

export interface CalcDragIntentEvent {
    targetWidth?: number
    targetHeight?: number
    targetX?: number
    targetY?: number
    initialClientX: number
    initialClientY: number
    clientX: number
    clientY: number
}

export interface CalcDragIntentOptions {
    // defaults to `12`
    cols?: number
    // defaults to `8`
    edgeSize?: number
}

export const calcIntentPos = (event: CalcDragIntentEvent, options: CalcDragIntentOptions = {}): DndDragIntentPos | undefined => {
    const {
        clientY, clientX,
        initialClientX, initialClientY,
        targetWidth = 0,
        targetHeight = 0,
        targetX = 0,
        targetY = 0,
    } = event
    const {
        cols = 12,
        edgeSize = 8,
    } = options
    const intent: DndDragIntentPos = {
        x: DndIntents.same,
        y: DndIntents.same,
        colX: 0,
        colY: 0,
        edgeY: undefined,
        edgeX: undefined,
        posQuarter: undefined,
    }
    const offsetX = (clientX - targetX)
    const offsetY = (clientY - targetY)

    intent.colX = Math.ceil(Number((offsetX / (targetWidth / cols)).toFixed(0)))
    intent.colY = Math.ceil(Number((offsetY / (targetHeight / cols)).toFixed(0)))

    if (intent.colX > 6 && intent.colY <= 6) {
        intent.posQuarter = 'top-right'
    } else if (intent.colX <= 6 && intent.colY <= 6) {
        intent.posQuarter = 'top-left'
    } else if (intent.colX <= 6 && intent.colY > 6) {
        intent.posQuarter = 'bottom-left'
    } else if (intent.colX > 6 && intent.colY > 6) {
        intent.posQuarter = 'bottom-right'
    }

    if (offsetX < edgeSize) {
        intent.edgeX = 'left'
    } else if ((targetWidth - offsetX) < edgeSize) {
        intent.edgeX = 'right'
    }

    if (offsetY < edgeSize) {
        intent.edgeY = 'top'
    } else if ((targetHeight - offsetY) < edgeSize) {
        intent.edgeY = 'bottom'
    }

    if (clientX > initialClientX) {
        intent.x = DndIntents.right
    } else if (clientX < initialClientX) {
        intent.x = DndIntents.left
    }
    if (clientY > initialClientY) {
        intent.y = DndIntents.down
    } else if (clientY < initialClientY) {
        intent.y = DndIntents.up
    }

    return intent
}
