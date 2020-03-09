import React from "react";
import {Record, Map, List} from "immutable";
import {getDisplayName} from "../Utils/getDisplayName";
import {createMap} from "..";

const EditorStoreContext = React.createContext({});
const EditorContext = React.createContext({});

let EditorStoreProvider = ({children, ...props}) => <EditorStoreContext.Provider value={props} children={children}/>;
/**
 *
 * @param children
 * @param showValidity
 * @param widgets
 * @param t
 * @return {*}
 * @constructor
 */
let EditorProvider = ({children, ...props}) => <EditorContext.Provider value={props} children={children}/>;

const EditorStore = Record({
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

const createStore = (values) => {
    return new EditorStore({
        values,
        internals: Map({}),
        validity: Map({}),
    })
};

const createEmptyStore = (type = 'object') => createStore(
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

/**
 * @return {{schema: Map, valueStore: *, internalStore: Map, onChange: function, validity: Map}}
 */
const useSchemaStore = () => {
    const {store, onChange, schema} = React.useContext(EditorStoreContext);

    const valueStore = store.getValues();
    const internalStore = store.getInternals();
    const validity = store.getValidity();

    return {valueStore, internalStore, onChange, schema, validity};
};

const tDefault = () => '';

/**
 * @return {{
 *     widgets: {
 *         RootRenderer,
 *
 *     },
 *     t: function,
 *     showValidity: boolean,
 * }}
 */
const useEditor = () => {
    let context = React.useContext(EditorContext);
    if(!context.t) {
        context.t = tDefault;
    }
    return context;
};

/**
 * HOC to extract the value with the storeKeys, pushing only the component's value and onChange to it, not the whole store
 * @param Component
 * @return {function(*): *}
 */
const extractValue = (Component) => {
    const ExtractValue = p => {
        const {valueStore, onChange, internalStore} = useSchemaStore();
        return <Component
            {...p} onChange={onChange}
            value={p.storeKeys.size ?
                (Map.isMap(valueStore) || List.isList(valueStore) ? valueStore.getIn(p.storeKeys) : undefined)
                : valueStore}
            internalValue={p.storeKeys.size ? internalStore ? internalStore.getIn(p.storeKeys) : createMap() : internalStore}
        />
    };
    ExtractValue.displayName = `ExtractValue(${getDisplayName(Component)})`;
    return ExtractValue;
};

const extractValidity = (Component) => {
    const ExtractValidity = p => {
        const {validity, onChange} = useSchemaStore();
        return <Component {...p} validity={p.storeKeys.size ? validity.getIn(p.storeKeys) : validity} onChange={onChange}/>
    };
    ExtractValidity.displayName = `ExtractValidity(${getDisplayName(Component)})`;
    return ExtractValidity;
};

const withEditor = (Component) => {
    const WithEditor = p => {
        const editor = useEditor();
        return <Component {...p} {...editor}/>
    };
    WithEditor.displayName = `WithEditor(${getDisplayName(Component)})`;
    return WithEditor;
};

const hasStoreKeys = storeKeys => (Array.isArray(storeKeys) && storeKeys.length) || storeKeys.size;

const prependKey = (storeKeys, key) =>
    Array.isArray(storeKeys) ?
        [key, ...storeKeys] :
        storeKeys.splice(0, 0, key);

const updateRawValue = (store, storeKeys, key, value) =>
    hasStoreKeys(storeKeys) ?
        store.setIn(
            prependKey(storeKeys, key),
            value
        ) :
        store.set(key, value);

const deleteRawValue = (store, storeKeys, key) =>
    hasStoreKeys(storeKeys) ?
        store.deleteIn(prependKey(storeKeys, key)) :
        store.delete(key);

const updateInternalValue = (storeKeys, internalValue) => store => {
    return updateRawValue(store, storeKeys, 'internals', internalValue);
};

/**
 * Function capable of either updating a deep value in the `store`, or when in e.g. root-level directly the store (string as root-schema)
 * @param storeKeys
 * @param value
 * @return {function(*): *}
 */
const updateValue = (storeKeys, value,) => store => {
    return updateRawValue(store, storeKeys, 'values', value)
};

/**
 *
 * @param storeKeys
 * @param value
 * @param internalValue
 * @return {function(*=): *}
 */
const updateValues = (storeKeys, value, internalValue) => store => {
    store = updateRawValue(store, storeKeys, 'internals', internalValue);
    return updateRawValue(store, storeKeys, 'values', value)
};

/**
 * Function capable of either updating a deep value in the `store`, or when in e.g. root-level directly the store (string as root-schema)
 * @param storeKeys
 * @param valid
 * @return {function(*): *}
 */
const updateValidity = (storeKeys, valid) => store => (
    updateRawValue(store, storeKeys.push('__valid'), 'validity', valid)
);

const cleanUp = (storeKeys, key) => store => (
    deleteRawValue(store, storeKeys, key)
);

export {
    withEditor, useEditor, EditorStore,

    useSchemaStore,
    extractValue, updateValue,
    updateValues, updateInternalValue,
    extractValidity, updateValidity,
    EditorStoreProvider, EditorProvider,
    createEmptyStore, createStore,
    cleanUp, prependKey,
};
