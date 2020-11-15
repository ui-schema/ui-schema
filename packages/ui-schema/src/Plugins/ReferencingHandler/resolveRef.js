import {resolvePointer} from '@ui-schema/ui-schema/JSONPointer/resolvePointer';

export class SchemaRefPending extends Error {
}

export const resolveRef = (ref, context) => {
    const {
        // the definitions, could be get from ReferencingProvider
        defs,
        // the root schema, could be get from SchemaRootProvider
        schema: rootSchema,
        // try to get a loaded schema
        fetchSchema,
    } = context

    let schema

    if(ref.indexOf('#/definitions/') === 0 || ref.indexOf('#/$defs/') === 0) {
        // intercept JSON Pointer for definitions
        const refId = ref.replace(/^#\/definitions\//, '').replace(/^#\/\$defs\//, '');
        if(!defs) {
            console.error('definitions needed for $ref resolution', ref)
        } else if(defs.get(refId)) {
            schema = resolvePointer('#/' + refId, defs);
        } else {
            console.error('definition not found for $ref', ref, refId)
        }

    } else if(ref.indexOf('#/') === 0 || ref === '#') {
        // JSON Pointer

        if(!rootSchema) {
            console.error('rootSchema needed for $ref resolution', ref)
        } else {
            const targeted = resolvePointer(ref, rootSchema)
            if(targeted) {
                schema = targeted
            } else {
                console.error('JSON Pointer target schema not found for $ref', ref, rootSchema?.toJS())
            }
        }
    } else if(ref.indexOf('#') === 0) {
        // get by `$id` or since 2019-09 by `$anchor` in definitions

        if(!defs) {
            console.error('definitions needed for $ref resolution', ref)
        } else {
            const def = defs.find(def => {
                return (
                    // till draft-06, no `$`, hashtag in id
                    def.get('id') === ref ||
                    // till draft-07, hashtag in id
                    def.get('$id') === ref ||
                    // from 2019-09, fragment in anchor, without leading hashtag
                    def.get('$anchor') === ref.substr(1)
                )
            })

            if(def) {
                schema = def
            } else {
                console.error('definition not found for $ref', ref)
            }
        }
    } else {
        // todo:
        //   $recursiveRef
        //   $recursiveAnchor

        // handle network referenced schemas,
        // `fetchSchema` may be coming from `useNetworkRef`, which relies on the `UIApiProvider`
        // but could also be otherwise passed down with the context from a custom `ReferencingHandler` implementation

        const loadedSchema = fetchSchema(ref)
        if(loadedSchema) {
            schema = loadedSchema
        } else {
            throw new SchemaRefPending(ref)
        }
    }

    return schema
}
