import {Record, Map, List} from 'immutable';

// only to enable better minification, DO NOT EXPORT
const STR_INTERNALS = 'internals'
const STR_VALUES = 'values'
const STR_VALIDITY = 'validity'

export const UIStore = Record({
    values: undefined,
    // internals must be an map when it is an object in the root, for array a List and for other "any type"
    internals: Map({}),
    validity: Map({}),
    meta: Map({}),
    valuesToJS: function() {
        const values = this.get(STR_VALUES)
        if(Map.isMap(values) || List.isList(values) || Record.isRecord(values)) return values.toJS()

        return values
    },
    getValues: function() {
        return this.get(STR_VALUES)
    },
    getInternals: function() {
        return this.get(STR_INTERNALS)
    },
    getValidity: function() {
        return this.get(STR_VALIDITY)
    },
});

export const createStore = (values) => {
    return new UIStore({
        values,
        internals: Map({
            internals: List.isList(values) ? List() : Map(),
        }),
        validity: Map({}),
        meta: Map({}),
    })
};

export const createEmptyStore = (type = 'object') => createStore(
    type === 'array' ?
        List([]) :
        type === 'string' ?
            '' :
            type === 'number' || type === 'integer' ?
                0 :
                type === 'boolean' ?
                    false :
                    Map({}),
);


export const prependKey = (storeKeys, key) =>
    Array.isArray(storeKeys) ?
        [key, ...storeKeys] :
        storeKeys.splice(0, 0, key);

export const shouldDeleteOnEmpty = (value, force, type) => {
    // todo: mv number out here, enforces that numbers can be cleared, but should only be forced for the `""` value in number types
    if(!force && type !== 'number' && type !== 'integer') return false

    switch(type) {
        case 'string':
        case 'number':
        case 'integer':
            return value === '' || typeof value === 'undefined' || (typeof value === 'string' && 0 === value.trim().length)
        case 'boolean':
            return !value
        case 'array':
            return (List.isList(value) && value.size === 0) || (Array.isArray(value) && value.length === 0)
        case 'object':
            return (Map.isMap(value) && value.keySeq().size === 0) || (typeof value === 'object' && Object.keys(value).length === 0)
    }

    return false;
};

export const addNestKey = (storeKeysNestedKey, storeKeys) =>
    storeKeysNestedKey ? storeKeys.reduce((nk, sk) => nk?.concat(sk, List([storeKeysNestedKey])), List([storeKeysNestedKey])).splice(-1, 1) : storeKeys
