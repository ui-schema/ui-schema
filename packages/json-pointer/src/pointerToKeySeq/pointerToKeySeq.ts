import { List } from 'immutable'
import { unescapePointer } from '@ui-schema/json-pointer/unescapePointer'

export const pointerToKeySeq = (pointer: string): List<string | number> => {
    const pointerContent =
        pointer.startsWith('/') ? pointer.slice(1) :
            pointer.startsWith('#/') ? pointer.slice(2) :
                pointer === '#' ? '' :
                    // todo: if no valid pointer throw an exception in a future version
                    pointer

    if (!pointerContent) return List()

    const pointerPoints: (string | number)[] =
        pointerContent
            .split('/')
            .map(unescapePointer)

    return List(pointerPoints)
}
