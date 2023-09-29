import { parseRefs, SchemaRefsPending, useSchemaNetworkRef } from '@ui-schema/react/Decorators/ReferencingHandler'
import React from 'react'
import { UISchemaMap } from '@ui-schema/system/Definitions'
import { SchemaRootContext } from '@ui-schema/react/SchemaRootProvider'

export const useSchemaRef = (
    maybeRootSchema: UISchemaMap | undefined,
    definitions: SchemaRootContext['definitions'] | undefined,
    isRoot: boolean,
    schema: UISchemaMap,
): {
    schema: UISchemaMap
    refsPending: SchemaRefsPending
} => {
    const {getSchema, loadSchema} = useSchemaNetworkRef()

    const parseRes: {
        schema: UISchemaMap
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
