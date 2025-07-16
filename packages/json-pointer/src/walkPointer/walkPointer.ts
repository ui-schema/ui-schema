import { pointerToKeySeq } from '@ui-schema/json-pointer/pointerToKeySeq'

export function walkPointer(
    pointer: string,
    data: unknown,
    pick: (current: unknown, key: string | number) => unknown,
): any {
    const keySeq = pointerToKeySeq(pointer)
    if (!keySeq.size) return data
    let current = data
    for (const key of keySeq) {
        if (typeof current === 'undefined') {
            return undefined
        }
        current = pick(current, key)
    }
    return current
}
