import React from "react";

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

const useSchemaTrans = () => {
    let context = React.useContext(EditorTransContext);
    if(!context.t) {
        context.t = t => t;
    }
    return context;
};

const withData = (Component) => {
    return p => {
        const schemaData = useSchemaData();
        return <Component {...schemaData} {...p}/>
    }
};

const withValidity = (Component) => {
    return p => {
        const schemaValidity = useSchemaValidity();
        return <Component {...schemaValidity} {...p}/>
    }
};

const withWidgets = (Component) => {
    return p => {
        const {widgets} = useSchemaWidgets();
        return <Component widgets={widgets} {...p}/>
    }
};

const withTrans = (Component) => {
    return p => {
        const {t} = useSchemaTrans();
        return <Component t={t} {...p}/>
    }
};

export {
    useSchemaData, withData,
    useSchemaValidity, withValidity,
    useSchemaWidgets, withWidgets,
    useSchemaTrans, withTrans,
    EditorDataProvider, EditorValidityProvider, EditorWidgetsProvider, EditorTransProvider,
};
