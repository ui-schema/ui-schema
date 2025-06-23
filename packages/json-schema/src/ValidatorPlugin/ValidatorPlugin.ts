import { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { SchemaResource } from '@ui-schema/ui-schema/SchemaResource'
import { createOrdered } from '@ui-schema/ui-schema/createMap'
import { SchemaPlugin } from '@ui-schema/ui-schema/SchemaPlugin'
import { Map, List } from 'immutable'

/**
 * @todo rewrite as a more reliable schema-reduction, only a first PoC scribble
 *       - `properties` should only be needed to be merged in first level, but if a property exists in multiple
 *         applied schemas, their schema could be added as `allOf`, to not merge lower levels directly but once that property is rendered
 *       - similar for `items`/`prefixItems`
 *          - especially tuple type items must not be concatenated, maybe build an intersection
 *       - merge all `required` into a single list
 *       - `enum` must be reduced to their intersection
 *          - same for minLength/maxLength and all other validation keywords where this is possible
 *       - conflicting `const` must be kept, to apply as `allOf.const`
 *          - same for `pattern` and all other validation keywords here no intersection can be produced
 */
export function mergeSchemas(baseSchema: any, ...appliedSchemas: any[]) {
    let schema = baseSchema as Map<string, any>
    appliedSchemas.forEach(appliedSchema => {
        // if (schema.has('required') && appliedSchema.has('required')) {
        //     schema = schema.set('required', schema.get('required').push(...appliedSchema.get('required')))
        // }

        if (schema.has('properties') && appliedSchema.has('properties')) {
            appliedSchema.get('properties').forEach((subSchema, key) => {
                if (schema.hasIn(['properties', key])) {
                    schema = schema.updateIn(
                        ['properties', key, 'allOf'],
                        (allOf = List()) => {
                            // @ts-expect-error
                            return allOf.push(subSchema)
                        },
                    )
                } else {
                    schema = schema.setIn(['properties', key], subSchema)
                }
            })
            appliedSchema = appliedSchema.delete('properties')
        }

        schema = schema.mergeDeep(appliedSchema)
    })
    return schema
}

export const validatorPlugin: SchemaPlugin<Omit<WidgetPluginProps, 'currentPluginIndex'> & { resource?: SchemaResource }> = {
    handle: (props) => {
        if (!props.validate) return {}
        const ownKey = props.storeKeys?.last()
        // todo: use `validate` from context - would require to add it to SchemaPlugin props interface
        const result = props.validate(
            props.schema,
            props.value,
            {
                instanceLocation: props.storeKeys?.toArray() || [],
                // note: the keywordLocation can't be reliable known at this position due to schema reduction for rendering
                keywordLocation: [],
                instanceKey: ownKey,
                parentSchema: props.parentSchema,
                resource: props.resource,
            },
        )
        const applicableSchema = mergeSchemas(props.schema, ...result.applied || [])
        if (result.valid) {
            return {
                valid: true,
                schema: applicableSchema,
            }
        }
        const errors = createOrdered(result.errors)
        return {
            valid: false,
            errors: errors,
            schema: applicableSchema,
        }
    },
}
