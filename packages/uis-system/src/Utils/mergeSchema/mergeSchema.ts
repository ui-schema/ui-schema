import { List, Map } from 'immutable'
import { UISchemaMap } from '@ui-schema/system/Definitions'

/**
 * Merges schema `b` into `a`
 */
export const mergeSchema = (
    aSchema: UISchemaMap,
    bSchema: UISchemaMap = Map(),
): UISchemaMap => {
    if (bSchema.get('properties')) {
        if (aSchema.get('properties')) {
            aSchema = aSchema.update(
                'properties', properties => {
                    properties = properties.merge(
                        bSchema.get('properties')?.map(
                            (prop, key) =>
                                properties.get(key) ? mergeSchema(properties.get(key), prop) : prop
                            ,
                        ),
                    )

                    return properties
                },
            )
        } else {
            aSchema = aSchema.set('properties', bSchema.get('properties'))
        }
    }

    if (bSchema.get('required')) {
        if (aSchema.get('required')) {
            aSchema = aSchema.set('required', aSchema.get('required')?.concat(bSchema.get('required')))
        } else {
            aSchema = aSchema.set('required', bSchema.get('required'))
        }
    }

    if (bSchema.get('enum')) {
        aSchema = aSchema.update('enum', (enum_ = List()) => enum_.concat(bSchema.get('enum')).toSet().toList())
    }

    if (bSchema.get('oneOf')) {
        aSchema = aSchema.set('oneOf',
            aSchema.get('oneOf') ?
                aSchema.get('oneOf')?.concat(bSchema.get('oneOf')) :
                bSchema.get('oneOf'),
        )
    }

    // merge all not-custom controlled values
    let bSchemaTmp = bSchema
    bSchemaTmp = bSchemaTmp.deleteAll(['properties', 'required', 'enum'])
    aSchema = aSchema.mergeDeep(bSchemaTmp)
    // todo: should all of the current merged, like they are merged

    return aSchema
}
