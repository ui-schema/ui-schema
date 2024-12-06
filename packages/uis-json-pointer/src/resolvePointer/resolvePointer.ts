import { walkPointer } from '@ui-schema/json-pointer/walkPointer'
import { List, Map, Record } from 'immutable'

export const resolvePointer = (
    pointer: string,
    data: unknown,
): any => {
    return walkPointer(
        pointer, data,
        (current, key) => {
            if (List.isList(current) || Array.isArray(current)) {
                const index = Number(key)
                if (Number.isNaN(index)) {
                    return undefined
                }
                return Array.isArray(current) ? current[index] : current.get(index)
            } else if (Map.isMap(current) || Record.isRecord(current)) {
                // @ts-expect-error Record typing is incompatible
                return current.get(key)
            } else if (typeof current === 'object' && current) {
                return current[key]
            }
            return undefined
        },
    )
}
