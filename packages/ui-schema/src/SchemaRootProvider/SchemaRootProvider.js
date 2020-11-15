import React from 'react'

const SchemaRootContext = React.createContext({
    id: '',
    schema: null,
});

export const SchemaRootProvider = ({id, schema, children}) => {
    const context = React.useMemo(() => ({
        id, schema,
    }), [id, schema])

    return <SchemaRootContext.Provider value={context}>
        {children}
    </SchemaRootContext.Provider>
}

export const useSchemaRoot = () => {
    return React.useContext(SchemaRootContext);
}
