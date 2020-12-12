import React from 'react'
import {getSchemaId} from '@ui-schema/ui-schema/Utils/getSchema';

export const isRootSchema = (schema) => {
    const id = getSchemaId(schema)
    // todo: is this "no fragment beginning" really the correct root for everything? e.g. $defs?
    return id && id.indexOf('#') !== 0
}

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
