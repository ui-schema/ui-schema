import { List } from 'immutable'
import { unescapePointer } from '@ui-schema/json-pointer/unescapePointer'

function isInt(value) {
    let x
    if (isNaN(value)) {
        return false
    }
    x = parseFloat(value)
    return (x | 0) === x
}

export const pointerToKeySeq = (pointer: string): List<string | number> => {
    // todo: take # fragment pointers into account for correct descaping (URI decode)
    const pointerPoints: (string | number)[] =
        (
            pointer.startsWith('/') ? pointer.slice(1) :
                pointer.startsWith('#/') ? pointer.slice(2) : pointer
        )
            .split('/')
            .map(point => {
                let key: string | number = unescapePointer(point)
                const nKey = key.trim() !== '' && Number(key)
                if (typeof nKey === 'number' && !isNaN(nKey) && isInt(nKey) && key.indexOf('.') === -1) {
                    key = parseInt(key)
                }
                return key
            })
    if (pointerPoints.length === 1 && pointerPoints[0] === '') {
        pointerPoints.splice(0, 1)
    }
    //console.log(pointerPoints, pointer)
    return List(pointerPoints)
}
