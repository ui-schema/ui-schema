import { pointerToKeySeq } from '@ui-schema/json-pointer/pointerToKeySeq'
import { List, Map, OrderedMap } from 'immutable'

export const resolvePointer = (
    pointer: string,
    data: Map<string | number, any> | OrderedMap<string | number, any> | List<any>
): any => {
    const keySeq = pointerToKeySeq(pointer)
    return keySeq.size ? data.getIn(keySeq) : data
}
