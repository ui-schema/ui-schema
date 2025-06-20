import { SchemaResource, resourceFromSchema } from '@ui-schema/json-schema/SchemaResource'
import React, { useContext, useMemo } from 'react'
import { memo } from '@ui-schema/react/Utils/memo'

export interface SchemaResourceContext {
    resource: SchemaResource | undefined
}

const SchemaResourceContext = React.createContext<SchemaResourceContext>({
    //id: undefined,
    resource: undefined,
})

export interface SchemaResourceProviderProps {
    schema?: any

    resource?: SchemaResource

    loadSchema?: (
        canonicalRef: string,
        version?: string,
    ) => Promise<{ resource: SchemaResource } | { schema: any }>

    resources?: Record<string, SchemaResource>
}

export const SchemaResourceProviderBase = (props: React.PropsWithChildren<SchemaResourceProviderProps>): React.ReactElement => {
    const {resource, resources, schema, children} = props
    const context = useMemo(() => {
        if (resources && resource) {
            throw new Error('Props resources and resource are mutually exclusive, provide schema + resources or use resources while building the resource.')
        }
        return {
            resource: resource || (schema ? resourceFromSchema(schema, {resources}) : undefined),
        }
    }, [resource, resources, schema])

    // todo: implement loading unresolved, incl. state to know which are loading
    // context.resource?.unresolved

    return <SchemaResourceContext.Provider value={context}>
        {children}
    </SchemaResourceContext.Provider>
}

export const SchemaResourceProvider = memo(SchemaResourceProviderBase)

export const useSchemaResource = (): SchemaResourceContext => {
    return useContext(SchemaResourceContext) as SchemaResourceContext
}
