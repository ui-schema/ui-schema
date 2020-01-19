import React from "react";
import {Seq, OrderedMap} from "immutable";

const SchemaEditorContext = React.createContext({});

const EDIT_DATA = 'EDIT_DATA';
const EDIT_SCHEMA = 'EDIT_SCHEMA';

const reducer = (state, action) => {
    switch(action.type) {
        case EDIT_DATA:
            /*state.editedUser = state.editedUser
                .setIn([action.userId, ...action.keys], action.val)
                .setIn([action.userId, 'lastEditAt'], action.lastEditAt);*/

            return {
                ...state,
                store: state.store.setIn(action.keys, action.val),
            };

        case EDIT_SCHEMA:
            return {
                ...state,
                schema: state.schema.setIn(action.keys, action.val),
            };

        default:
            return state;
    }
};

function fromJSOrdered(js) {
    return typeof js !== 'object' || js === null ? js :
        Array.isArray(js) ?
            Seq(js).map(fromJSOrdered).toList() :
            Seq(js).map(fromJSOrdered).toOrderedMap();
}

/**
 * Reducer Store initializer, either creates new immutable nested maps or uses provided (e.g. to connect multiple with each other)
 *
 * @todo for connect multiple schema editors it must be possible to either pass childStore or also storeKeys down
 *
 * @param schema
 * @param data
 * @param widgets
 * @param storeMap
 * @param schemaMap
 * @return {{schema: OrderedMap, store: OrderedMap, widgets: {}}}
 */
const init = ({schema, data, widgets, storeMap, schemaMap} = {}) => {
    return {
        store: storeMap || new OrderedMap(fromJSOrdered(data)),
        schema: schemaMap || new OrderedMap(fromJSOrdered(schema)),
        widgets: widgets,
    }
};

const SchemaEditorProvider = ({children, ...props} = {}) => (

    // todo: add here useEffect with dependencies [schema, data, widgets] with dispatch to re-new the whole editor on prop chanegs

    <SchemaEditorContext.Provider
        value={React.useReducer(reducer, props, init)}
    >
        {children}
    </SchemaEditorContext.Provider>
);

const editData = (keys, val) => ({
    type: EDIT_DATA,
    keys,
    val,
    lastEditAt: new Date(),
});

const editSchema = (keys, val) => ({
    type: EDIT_SCHEMA,
    keys,
    val,
    lastEditAt: new Date(),
});

const useSchemaEditor = () => {
    const [state, dispatch] = React.useContext(SchemaEditorContext);

    const setData = React.useCallback((keys, val) => {
        dispatch(editData(keys, val));
    }, [dispatch]);

    const setSchema = React.useCallback((keys, val) => {
        dispatch(editSchema(keys, val));
    }, [dispatch]);

    return {
        ...state,
        setData,
        setSchema,
    }
};

export {SchemaEditorProvider, useSchemaEditor};
