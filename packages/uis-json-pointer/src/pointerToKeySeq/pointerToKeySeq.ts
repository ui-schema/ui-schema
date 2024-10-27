import { List } from 'immutable'
import { unescapePointer } from '@ui-schema/json-pointer/unescapePointer'

function isInt(value) {
    if (isNaN(value)) {
        return false
    }
    const x = parseFloat(value)
    return (x | 0) === x
}

export const pointerToKeySeq = (pointer: string): List<string | number> => {
    // todo: take # fragment pointers into account for correct resolving of absolute vs. relative points
    const pointerContent =
        pointer.startsWith('/') ? pointer.slice(1) :
            pointer.startsWith('#/') ? pointer.slice(2) :
                pointer.startsWith('#') ? pointer.slice(1) : pointer

    if (!pointerContent) return List()

    const pointerPoints: (string | number)[] =
        pointerContent
            .split('/')
            .map(point => {
                let key: string | number = unescapePointer(point)
                const nKey = key.trim() !== '' && Number(key)
                if (typeof nKey === 'number' && !isNaN(nKey) && isInt(nKey) && key.indexOf('.') === -1) {
                    key = parseInt(key)
                }
                return key
            })

    return List(pointerPoints)
}
