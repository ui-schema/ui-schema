import React from 'react'
import { OrderedMap } from 'immutable'
import { getSchemaId } from '@ui-schema/system/Utils/getSchema'
import { memo } from '@ui-schema/react/Utils/memo'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export interface SchemaRootContext {
    id?: string | undefined
    // the root schema for e.g. JSONPointer resolving
    schema?: UISchemaMap
    definitions?: OrderedMap<string, UISchemaMap>
}

export const isRootSchema = (schema: UISchemaMap): boolean => {
    const id = getSchemaId(schema)
    // todo: is this "no fragment beginning" really the correct root for everything? e.g. $defs?
    return Boolean(id && id.indexOf('#') !== 0)
}

const SchemaRootContext = React.createContext<SchemaRootContext>({
    id: undefined,
    schema: undefined,
})

export const SchemaRootProviderBase = <C extends {} = { [k: string]: any }>(props: React.PropsWithChildren<SchemaRootContext & C>): React.ReactElement => {
    const {id, schema, children, ...further} = props
    const context = React.useMemo(() => ({
        id, schema, ...further,
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [id, schema, ...Object.values(further)])

    return <SchemaRootContext.Provider value={context}>
        {children}
    </SchemaRootContext.Provider>
}

export const SchemaRootProvider = memo(SchemaRootProviderBase)

export const useSchemaRoot = <C extends {} = { [k: string]: any }>(): SchemaRootContext & C => {
    return React.useContext(SchemaRootContext) as SchemaRootContext & C
}
