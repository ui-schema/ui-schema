import {List} from "immutable";
import {prependKey, updateValues} from "../../EditorStore";

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

    const srcItem = value.get(oldI);

    if(List.isList(value)) {
        return value.splice(oldI, 1).splice(newI, 0, srcItem);
    }

    return value;
};

/**
 * Creates an onChange handler that is capable of moving an item in an array in the immutable store
 * @param {function} onChange
 * @param {List} storeKeys
 * @param {int} go if positive will move the number further e.g.: `2` positions further: old is 1, new is 3, go is `2`; when negative will move back: old is 3, new is 1, go is `-2`
 * @return {function(...[*]=)}
 */
export const storeMoveItem = (onChange, storeKeys, go) => () => {
    onChange(store => {
        const valueStoreKeys = storeKeys.slice(0, -1);
        const index = storeKeys.slice(-1).get(0);

        return updateValues(
            valueStoreKeys,
            moveItem(store.getIn(prependKey(valueStoreKeys, 'values')), index, index + go),
            moveItem(store.getIn(prependKey(valueStoreKeys, 'internals')), index, index + go),
        )(store);
    })
};
