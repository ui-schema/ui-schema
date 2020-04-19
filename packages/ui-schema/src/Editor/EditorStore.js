import React from "react";
import {Record, Map, List} from "immutable";
import {getDisplayName} from "../Utils/getDisplayName";
import {createMap} from "../Utils/createMap";
import {relT} from "../Utils/Trans/relT";

const EditorStoreContext = React.createContext({});
const EditorContext = React.createContext({});

export const EditorStoreProvider = ({children, ...props}) => <EditorStoreContext.Provider value={props} children={children}/>;

export const EditorProvider = ({children, ...props}) => <EditorContext.Provider value={props} children={children}/>;

export const EditorStore = Record({
    values: undefined,
    internals: Map({}),
    validity: Map({}),
    getValues: function() {
        return this.get('values')
    },
    getInternals: function() {
        return this.get('internals')
    },
    getValidity: function() {
        return this.get('validity')
    }
});

export const createStore = (values) => {
    return new EditorStore({
        values,
        internals: Map({}),
        validity: Map({}),
    })
};

export const createEmptyStore = (type = 'object') => createStore(
    type === 'array' ?
        List([]) :
        type === 'string' ?
            '' :
            type === 'number' ?
                0 :
                type === 'boolean' ?
                    false :
                    Map({})
);

export const useSchemaStore = () => {
    const {store, onChange, schema} = React.useContext(EditorStoreContext);

    return {store, onChange, schema};
};

const tDefault = (text, context = {}, schema) =>
    relT(schema, context);

export const useEditor = () => {
    let context = React.useContext(EditorContext);
    if(!context.t) {
        context.t = tDefault;
    }
    return context;
};

/**
 * HOC to extract the value with the storeKeys, pushing only the component's value and onChange to it, not the whole store
 */
export const extractValue = (Component) => {
    const ExtractValue = p => {
        const {store, onChange} = useSchemaStore();
        return <Component
            {...p} onChange={onChange}
            value={p.storeKeys.size ?
                (Map.isMap(store.getValues()) || List.isList(store.getValues()) ? store.getValues().getIn(p.storeKeys) : undefined)
                : store.getValues()}
            internalValue={p.storeKeys.size ? store.getInternals() ? store.getInternals().getIn(p.storeKeys) : createMap() : store.getInternals()}
        />
    };
    ExtractValue.displayName = `ExtractValue(${getDisplayName(Component)})`;
    return ExtractValue;
};

export const extractValidity = (Component) => {
    const ExtractValidity = p => {
        const {store, onChange} = useSchemaStore();
        return <Component {...p} validity={p.storeKeys.size ? store.getValidity().getIn(p.storeKeys) : store.getValidity()} onChange={onChange}/>
    };
    ExtractValidity.displayName = `ExtractValidity(${getDisplayName(Component)})`;
    return ExtractValidity;
};

export const withEditor = (Component) => {
    const WithEditor = p => {
        const editor = useEditor();
        return <Component {...p} {...editor}/>
    };
    WithEditor.displayName = `WithEditor(${getDisplayName(Component)})`;
    return WithEditor;
};

const hasStoreKeys = storeKeys => (Array.isArray(storeKeys) && storeKeys.length) || storeKeys.size;

export const prependKey = (storeKeys, key) =>
    Array.isArray(storeKeys) ?
        [key, ...storeKeys] :
        storeKeys.splice(0, 0, key);

export const updateRawValue = (store, storeKeys, key, value) =>
    hasStoreKeys(storeKeys) ?
        store.setIn(
            prependKey(storeKeys, key),
            value
        ) :
        store.set(key, value);

export const deleteRawValue = (store, storeKeys, key) =>
    hasStoreKeys(storeKeys) ?
        store.deleteIn(prependKey(storeKeys, key)) :
        store.delete(key);

export const updateInternalValue = (storeKeys, internalValue) => store => {
    return updateRawValue(store, storeKeys, 'internals', internalValue);
};

/**
 * Function capable of either updating a deep value in the `store`, or when in e.g. root-level directly the store (string as root-schema)
 */
export const updateValue = (storeKeys, value,) => store => {
    return updateRawValue(store, storeKeys, 'values', value)
};

export const updateValues = (storeKeys, value, internalValue) => store => {
    store = updateRawValue(store, storeKeys, 'internals', internalValue);
    return updateRawValue(store, storeKeys, 'values', value)
};

/**
 * Function capable of either updating a deep value in the `store`, or when in e.g. root-level directly the store (string as root-schema)
 */
export const updateValidity = (storeKeys, valid) => store => (
    updateRawValue(store, storeKeys.push('__valid'), 'validity', valid)
);

export const cleanUp = (storeKeys, key) => store => (
    deleteRawValue(store, storeKeys, key)
);
