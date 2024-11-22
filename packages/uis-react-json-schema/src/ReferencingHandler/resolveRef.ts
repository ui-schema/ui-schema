import { resolvePointer } from '@ui-schema/json-pointer/resolvePointer'
import { ParseRefsContent } from './parseRefs.js'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export class SchemaRefPending extends Error {
}

export const resolveRef = (ref: string, context: ParseRefsContent, schemaVersion?: string): UISchemaMap | undefined => {
    const {
        // the id of the parent schema
        id,
        // the definitions, could be get from ReferencingProvider
        defs,
        // the root schema, could be get from SchemaRootProvider
        root: rootSchema,
        // try to get a loaded schema
        getLoadedSchema,
    } = context

    let schema: UISchemaMap | undefined = undefined

    if (ref.indexOf('#/definitions/') === 0 || ref.indexOf('#/$defs/') === 0) {
        // intercept JSON Pointer for definitions
        const refId = ref.replace(/^#\/definitions\//, '').replace(/^#\/\$defs\//, '')
        if (!defs) {
            if (process.env.NODE_ENV === 'development') {
                console.error('definitions needed for $ref resolution', ref)
            }
        } else if (defs.get(refId)) {
            schema = resolvePointer('#/' + refId, defs as any)
        } else {
            if (process.env.NODE_ENV === 'development') {
                console.error('definition not found for $ref', ref, refId)
            }
        }

    } else if (ref.indexOf('#/') === 0 || ref === '#') {
        // JSON Pointer

        if (!rootSchema) {
            if (process.env.NODE_ENV === 'development') {
                console.error('rootSchema needed for $ref resolution', ref)
            }
        } else {
            const targeted = resolvePointer(ref, rootSchema as any)
            if (targeted) {
                schema = targeted
            } else {
                if (process.env.NODE_ENV === 'development') {
                    console.error('JSON Pointer target schema not found for $ref', ref, rootSchema?.toJS())
                }
            }
        }
    } else if (ref.indexOf('#') === 0) {
        // get by `$id` or since 2019-09 by `$anchor` in definitions

        if (!defs) {
            if (process.env.NODE_ENV === 'development') {
                console.error('definitions needed for $ref resolution', ref)
            }
        } else {
            const def = defs.find(def => {
                return (
                    // till draft-06, no `$`, hashtag in id
                    def.get('id') === ref ||
                    // till draft-07, hashtag in id
                    def.get('$id') === ref ||
                    // from 2019-09, fragment in anchor, without leading hashtag
                    def.get('$anchor') === ref.slice(1)
                )
            })

            if (def) {
                schema = def
            } else {
                if (process.env.NODE_ENV === 'development') {
                    console.error('definition not found for $ref', ref)
                }
            }
        }
    } else {
        // todo:
        //   $recursiveRef
        //   $recursiveAnchor

        // handle network referenced schemas,
        // `getLoadedSchema` may be coming from `useNetworkRef`, which relies on the `UIApiProvider`
        // but could also be otherwise passed down with the context from a custom `ReferencingHandler` implementation
        if (getLoadedSchema) {
            const loadedSchema = getLoadedSchema(ref, id, schemaVersion)
            if (loadedSchema) {
                return loadedSchema
            }
        } else if (process.env.NODE_ENV === 'development') {
            console.error('getLoadedSchema does not exist in resolveRef, maybe UIApiProvider missing?')
        }
        throw new SchemaRefPending(ref)
    }

    return schema
}
