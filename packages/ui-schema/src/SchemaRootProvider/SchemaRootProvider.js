import React from 'react'
import {getSchemaId} from '@ui-schema/ui-schema/Utils/getSchema';
import {memo} from '@ui-schema/ui-schema/Utils/memo';

export const isRootSchema = (schema) => {
    const id = getSchemaId(schema)
    // todo: is this "no fragment beginning" really the correct root for everything? e.g. $defs?
    return id && id.indexOf('#') !== 0
}

const SchemaRootContext = React.createContext({
    id: undefined,
    schema: undefined,
});

export const SchemaRootProviderBase = ({id, schema, children, ...further} = {}) => {
    const context = React.useMemo(() => ({
        id, schema, ...further,
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [id, schema, ...Object.values(further)])

    return <SchemaRootContext.Provider value={context}>
        {children}
    </SchemaRootContext.Provider>
}

export const SchemaRootProvider = memo(SchemaRootProviderBase)

export const useSchemaRoot = () => {
    return React.useContext(SchemaRootContext);
}
