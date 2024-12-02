import { List } from 'immutable'
import { unescapePointer } from '@ui-schema/json-pointer/unescapePointer'

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
            .map(unescapePointer)

    return List(pointerPoints)
}
