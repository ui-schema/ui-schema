import { createOrdered } from '@ui-schema/system/createMap'
import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'

export const validatorPlugin: SchemaPlugin = {
    handle: (props) => {
        if (!props.validate) return {}
        const ownKey = props.storeKeys?.last()
        // todo: use `validate` from context - would require to add it to SchemaPlugin props interface
        const result = props.validate(
            props.schema,
            props.value,
            {
                instanceLocation: props.storeKeys?.toArray() || [],
                instanceKey: ownKey,
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
