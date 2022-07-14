import { pointerToKeySeq } from '@ui-schema/json-pointer/pointerToKeySeq'
import { Map, OrderedMap } from 'immutable'

export const resolvePointer = (pointer: string, data: Map<string, any> | OrderedMap<string, any>): any => {
    const keySeq = pointerToKeySeq(pointer)
    return keySeq.size ? data.getIn(keySeq) : data
}
