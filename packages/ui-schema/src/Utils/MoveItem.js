const moveItem = (value, oldI, newI) => {
    if(!value || 0 > newI || value.size < newI) return value;

    const srcItem = value.get(oldI);

    return value.splice(oldI, 1).splice(newI, 0, srcItem);
};

/**
 * Creates an onClick handler that is capable of moving an item in an array in the immutable store
 * @param {function} onChange
 * @param {List} storeKeys
 * @param {int} go if positive will move the number further e.g.: `2` positions further: old is 1, new is 3, go is `2`; when negative will move back: old is 3, new is 1, go is `-2`
 * @return {function(...[*]=)}
 */
const storeMoveItem = (onChange, storeKeys, go) => () => {
    onChange(store => {
        const valueStoreKeys = storeKeys.slice(0, -1);
        const index = storeKeys.slice(-1).get(0);
        return store.setIn(valueStoreKeys, moveItem(store.getIn(valueStoreKeys), index, index + go))
    })
};

export {moveItem, storeMoveItem}
