import type { MouseEventHandler } from 'react'

export const handleMouseMoveInDraggable = (
    noDragOnNodes: string[] | undefined,
    canDrag: boolean,
    setDisableDrag: (disableDrag: boolean) => void,
): MouseEventHandler =>
    (e) => {
        if (!noDragOnNodes || noDragOnNodes.length === 0) {
            return
        }
        // all of this `disableDrag` is primary to fix the FF bug:
        // https://bugzilla.mozilla.org/show_bug.cgi?id=800050

        // @ts-ignore
        if (noDragOnNodes.indexOf(e.target.nodeName) === -1) {
            if (!canDrag) {
                setDisableDrag(false)
            }
            return
        }
        e.stopPropagation()
        if (canDrag) {
            setDisableDrag(true)
        }
    }
