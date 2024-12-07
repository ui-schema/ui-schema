import { SchemaResource } from '@ui-schema/json-schema/SchemaResource'
import { createOrdered } from '@ui-schema/system/createMap'
import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'
import { WidgetPayload } from '@ui-schema/system/Widget'

export const validatorPlugin: SchemaPlugin<WidgetPayload & { resource?: SchemaResource }> = {
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
            },
            {
                resource: props.resource,
            },
        )
        if (result.valid) {
            return {
                valid: true,
            }
        }
        const errors = createOrdered(result.errors)
        return {
            valid: false,
            errors: errors,
        }
    },
}
