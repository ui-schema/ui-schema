import { pointerToKeySeq } from '@ui-schema/json-pointer/pointerToKeySeq'
import { List, Map, Record } from 'immutable'

export const resolvePointer = (
    pointer: string,
    data: unknown,
): any => {
    const keySeq = pointerToKeySeq(pointer)
    if (!keySeq.size) return data
    let current = data
    for (const key of keySeq) {
        if (List.isList(current) || Array.isArray(current)) {
            const index = Number(key)
            if (Number.isNaN(index)) {
                return undefined
            }
            current = Array.isArray(current) ? current[index] : current.get(index)
        } else if (Map.isMap(current) || Record.isRecord(current)) {
            // @ts-expect-error Record typing is incompatible
            current = current.get(key)
        } else if (typeof current === 'object' && current) {
            current = current[key]
        } else {
            return undefined
        }
    }
    return current
}
