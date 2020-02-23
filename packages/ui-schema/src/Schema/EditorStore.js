import React from "react";
import {getDisplayName} from "../Utils/getDisplayName";

const EditorDataContext = React.createContext({});
const EditorValidityContext = React.createContext({});
const EditorWidgetsContext = React.createContext({});
const EditorTransContext = React.createContext({});

let EditorDataProvider = ({children, ...props}) => <EditorDataContext.Provider value={props} children={children}/>;
let EditorValidityProvider = ({children, ...props}) => <EditorValidityContext.Provider value={props} children={children}/>;
let EditorWidgetsProvider = ({children, ...props}) => <EditorWidgetsContext.Provider value={props} children={children}/>;
let EditorTransProvider = ({children, ...props}) => <EditorTransContext.Provider value={props} children={children}/>;

const useSchemaData = () => {
    return React.useContext(EditorDataContext);
};

const useSchemaValidity = () => {
    return React.useContext(EditorValidityContext);
};

const useSchemaWidgets = () => {
    return React.useContext(EditorWidgetsContext);
};

const tDefault = t => t;

const useSchemaTrans = () => {
    let context = React.useContext(EditorTransContext);
    if(!context.t) {
        context.t = tDefault;
    }
    return context;
};

const withData = (Component) => {
    const WithData = p => {
        const schemaData = useSchemaData();
        return <Component {...schemaData} {...p}/>
    };
    WithData.displayName = `WithData(${getDisplayName(Component)})`;
    return WithData;
};

/**
 * HOC to extract the value with the storeKeys, pushing only the component's value and onChange to it, not the whole store
 * @param Component
 * @return {function(*): *}
 */
const extractValue = (Component) => {
    const ExtractValue = p => {
        const {store, onChange} = useSchemaData();
        return <Component {...p} onChange={onChange} value={p.storeKeys.size ? store ? store.getIn(p.storeKeys) : undefined : store}/>
    };
    ExtractValue.displayName = `ExtractValue(${getDisplayName(Component)})`;
    return ExtractValue;
};

const extractValidity = (Component) => {
    const ExtractValidity = p => {
        const {validity, onValidity, showValidity} = useSchemaValidity();
        return <Component {...p} validity={validity ? validity.getIn(p.storeKeys) : undefined} onValidity={onValidity} showValidity={showValidity}/>
    };
    ExtractValidity.displayName = `ExtractValidity(${getDisplayName(Component)})`;
    return ExtractValidity;
};

const withValidity = (Component) => {
    const WithValidity = p => {
        const schemaValidity = useSchemaValidity();
        return <Component {...p} {...schemaValidity}/>
    };
    WithValidity.displayName = `WithValidity(${getDisplayName(Component)})`;
    return WithValidity;
};

const withWidgets = (Component) => {
    const WithWidgets = p => {
        const {widgets} = useSchemaWidgets();
        return <Component widgets={widgets} {...p}/>
    };
    WithWidgets.displayName = `WithWidgets(${getDisplayName(Component)})`;
    return WithWidgets;
};

const withTrans = (Component) => {
    const WithTans = p => {
        const {t} = useSchemaTrans();
        return <Component t={t} {...p}/>
    };
    WithTans.displayName = `WithTans(${getDisplayName(Component)})`;
    return WithTans;
};

/**
 * Function capable of either updating a deep value in the `store`, or when in e.g. root-level directly the store (string as root-schema)
 * @param storeKeys
 * @param value
 * @return {function(*): *}
 */
const updateValue = (storeKeys, value) => store => storeKeys.size ? store.setIn(storeKeys, value) : value;

export {
    useSchemaData, withData, extractValue,
    useSchemaValidity, withValidity, extractValidity,
    useSchemaWidgets, withWidgets,
    useSchemaTrans, withTrans,
    EditorDataProvider, EditorValidityProvider, EditorWidgetsProvider, EditorTransProvider,
    updateValue,
};
