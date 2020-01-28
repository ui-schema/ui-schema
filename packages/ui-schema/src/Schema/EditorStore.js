import React from "react";

const EditorDataContext = React.createContext({});
const EditorValidityContext = React.createContext({});
const EditorWidgetsContext = React.createContext({});

let EditorDataProvider = React.memo(({children, ...props}) => <EditorDataContext.Provider value={props} children={children}/>);
let EditorValidityProvider = React.memo(({children, ...props}) => <EditorValidityContext.Provider value={props} children={children}/>);
let EditorWidgetsProvider = React.memo(({children, ...props}) => <EditorWidgetsContext.Provider value={props} children={children}/>);

const SchemaEditorProvider = ({
                                  children,
                                  schema,
                                  store, onChange,
                                  widgets, // t,
                                  validity, showValidity, onValidity,
                              } = {}) => {
    return <EditorDataProvider store={store} onChange={onChange} schema={schema}>
        <EditorValidityProvider validity={validity} showValidity={showValidity} onValidity={onValidity}>
            <EditorWidgetsProvider widgets={widgets}>
                {children}
            </EditorWidgetsProvider>
        </EditorValidityProvider>
    </EditorDataProvider>
};

const useSchemaData = () => {
    return React.useContext(EditorDataContext);
};

const useSchemaValidity = () => {
    return React.useContext(EditorValidityContext);
};

const useSchemaWidgets = () => {
    return React.useContext(EditorWidgetsContext);
};

export {
    SchemaEditorProvider,
    useSchemaData, useSchemaValidity, useSchemaWidgets,
    EditorDataProvider, EditorValidityProvider, EditorWidgetsProvider,
};
