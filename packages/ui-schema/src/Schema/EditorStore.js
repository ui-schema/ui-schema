import React from "react";

const EditorDataContext = React.createContext({});
const EditorValidityContext = React.createContext({});
const EditorWidgetsContext = React.createContext({});

let EditorDataProvider = ({children, ...props}) => <EditorDataContext.Provider value={props} children={children}/>;
let EditorValidityProvider = ({children, ...props}) => <EditorValidityContext.Provider value={props} children={children}/>;
let EditorWidgetsProvider = ({children, ...props}) => <EditorWidgetsContext.Provider value={props} children={children}/>;

const useSchemaData = () => {
    return React.useContext(EditorDataContext);
};

const useSchemaValidity = () => {
    return React.useContext(EditorValidityContext);
};

const useSchemaWidgets = () => {
    return React.useContext(EditorWidgetsContext);
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

export {
    useSchemaData, withData,
    useSchemaValidity, withValidity,
    useSchemaWidgets, withWidgets,
    EditorDataProvider, EditorValidityProvider, EditorWidgetsProvider,
};
