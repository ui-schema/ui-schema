import {List} from 'immutable';

/**
 * Map and List compatible 'switch place of item' function
 * @param value
 * @param oldI
 * @param newI
 * @return {[]|*}
 */
export const moveItem = (value, oldI, newI) => {
    if(
        !value ||
        newI < 0 || value.size <= newI ||
        oldI < 0 || value.size <= oldI
    ) return value;

    if(List.isList(value)) {
        const srcItem = value.get(oldI);
        return value.splice(oldI, 1).splice(newI, 0, srcItem);
    }

    return value;
};
