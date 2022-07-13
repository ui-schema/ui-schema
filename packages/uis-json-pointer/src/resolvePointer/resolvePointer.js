import {pointerToKeySeq} from '@ui-schema/json-pointer/pointerToKeySeq';

/**
 * @param {string} pointer
 * @param {Map<string, any>} data
 * @return {any}
 */
export const resolvePointer = (pointer, data) => {
    const keySeq = pointerToKeySeq(pointer)
    return keySeq.size ? data.getIn(keySeq) : data
}
