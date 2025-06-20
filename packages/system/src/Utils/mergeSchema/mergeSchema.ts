import { List, Map } from 'immutable'

/**
 * Merges schema `b` into `a`
 */
export const mergeSchema = <TSchema extends Map<unknown, unknown>>(
    aSchema: TSchema,
    bSchema: Map<unknown, unknown> = Map(),
): TSchema => {
    if (bSchema.get('properties')) {
        if (aSchema.get('properties')) {
            aSchema = aSchema.update(
                'properties', properties => {
                    const bProperties = bSchema.get('properties')
                    if (
                        !Map.isMap(properties)
                        || !Map.isMap(bProperties)
                    ) return properties
                    const aProperties = properties
                    return aProperties.merge(
                        bProperties?.map(
                            (prop, key) => {
                                const aProperty = aProperties.get(key)
                                if (Map.isMap(aProperty) && Map.isMap(prop)) {
                                    return mergeSchema(aProperty, prop)
                                }
                                return prop
                            },
                        ),
                    )
                },
            )
        } else {
            aSchema = aSchema.set('properties', bSchema.get('properties'))
        }
    }

    if (bSchema.get('required')) {
        if (aSchema.get('required')) {
            aSchema = aSchema.set('required', mergeListUnique(aSchema.get('required'), bSchema.get('required')))
        } else {
            aSchema = aSchema.set('required', bSchema.get('required'))
        }
    }

    if (bSchema.get('enum')) {
        aSchema = aSchema.set('enum', mergeListUnique(aSchema.get('enum'), bSchema.get('enum')))
    }

    if (bSchema.get('oneOf')) {
        const aOneOf = aSchema.get('oneOf')
        const bOneOf = bSchema.get('oneOf')
        aSchema = aSchema.set('oneOf',
            List.isList(aOneOf) ?
                aOneOf?.concat(bOneOf) :
                bOneOf,
        )
    }

    // merge all not-custom controlled values
    let bSchemaTmp = bSchema
    bSchemaTmp = bSchemaTmp.deleteAll(['properties', 'required', 'enum', 'oneOf'])
    aSchema = aSchema.mergeDeep(bSchemaTmp) as TSchema

    return aSchema
}

function mergeListUnique(a: unknown, b: unknown) {
    if (!List.isList(a) || !List.isList(b)) return b
    return a.concat(b).toSet().toList()
}
