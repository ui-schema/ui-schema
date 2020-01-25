import React from "react";
import {Seq, OrderedMap} from "immutable";

const SchemaEditorContext = React.createContext({});

const EDIT_DATA = 'EDIT_DATA';
const EDIT_SCHEMA = 'EDIT_SCHEMA';
const UPDATE_PASS_THROUGH = 'UPDATE_PASS_THROUGH';

const reduce = (state, action) => {
    switch(action.type) {
        case EDIT_DATA:
            return {
                ...state,
                store: state.store.setIn(action.keys, action.val),
            };

        case EDIT_SCHEMA:
            return {
                ...state,
                schema: state.schema.setIn(action.keys, action.val),
            };

        case UPDATE_PASS_THROUGH:
            if(!action.prop) return state;

            return {
                ...state,
                ...action.prop
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
 * @todo should defaults resolved at this point and not through using the reducer? could nested defaults at objects lead to mismatched data (wrong execution order)?
 *
 * @param schema
 * @param data
 * @param widgets
 * @param {function} t translator
 * @param {function} onChange
 * @param {function} onValidity
 * @param {boolean} showValidity
 * @return {{schema: OrderedMap, store: OrderedMap, widgets: {}}}
 */
const init = ({schema, data, widgets, t, onChange, onValidity, showValidity} = {}) => {
    return {
        store: new OrderedMap(fromJSOrdered(data)),
        schema: new OrderedMap(fromJSOrdered(schema)),
        widgets: widgets,
        t: t || (t1 => t1),
        onChange,
        onValidity,
        showValidity,
    }
};

const SchemaEditorProvider = ({children, ...props} = {}) => {

    // todo: a) add here useEffect with dependencies [schema, data, widgets] with dispatch to re-new the whole editor on prop changes
    // todo: b) ?

    const {showValidity, t, widgets, onChange, onValidity} = props;

    const reducer = React.useReducer(reduce, props, init);
    const [, dispatch] = reducer;

    // todo: this is bad, should use two provider, react may forget those sometimes

    React.useEffect(() => dispatch({
        type: UPDATE_PASS_THROUGH, prop: {showValidity}
    }), [showValidity]);

    React.useEffect(() => dispatch({
        type: UPDATE_PASS_THROUGH, prop: {t}
    }), [t]);

    React.useEffect(() => dispatch({
        type: UPDATE_PASS_THROUGH, prop: {widgets}
    }), [widgets]);

    React.useEffect(() => dispatch({
        type: UPDATE_PASS_THROUGH, prop: {onChange}
    }), [onChange]);

    React.useEffect(() => dispatch({
        type: UPDATE_PASS_THROUGH, prop: {onValidity}
    }), [onValidity]);

    return <SchemaEditorContext.Provider
        value={reducer}
    >
        {children}
    </SchemaEditorContext.Provider>
};

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
