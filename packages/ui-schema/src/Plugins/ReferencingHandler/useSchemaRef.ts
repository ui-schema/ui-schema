import { parseRefs, SchemaRefsPending, useNetworkRef } from '@ui-schema/ui-schema/Plugins/ReferencingHandler'
import React from 'react'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { SchemaRootContext } from '@ui-schema/ui-schema/SchemaRootProvider'

export const useSchemaRef = (
    maybeRootSchema: StoreSchemaType | undefined,
    definitions: SchemaRootContext['definitions'] | undefined,
    isRoot: boolean,
    schema: StoreSchemaType,
): {
    schema: StoreSchemaType
    refsPending: SchemaRefsPending
} => {
    const {getSchema, loadSchema} = useNetworkRef()

    const parseRes: {
        schema: StoreSchemaType
        pending: SchemaRefsPending
    } = React.useMemo(() => {
        return parseRefs(
            schema, {
                defs: definitions,
                root: isRoot ? schema : maybeRootSchema,
                getLoadedSchema: getSchema,
            },
        )
    }, [schema, definitions, isRoot, maybeRootSchema, getSchema])
    const refsPending: SchemaRefsPending = parseRes.pending

    if (refsPending.size <= 0) {
        schema = parseRes.schema
    }

    React.useEffect(() => {
        if (refsPending.size > 0) {
            refsPending.forEach((refs, rootId) => {
                refs.forEach((versions, refId) => {
                    loadSchema(refId, rootId, versions?.toArray())
                })
            })
        }
    }, [refsPending, loadSchema])

    return {
        schema,
        refsPending,
    }
}
