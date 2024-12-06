import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { SchemaResource } from '@ui-schema/json-schema/SchemaResource'
import { makeParams } from '@ui-schema/json-schema/Validator'
import { useSchemaResource } from '@ui-schema/react-json-schema/SchemaResourceProvider'
import { mergeSchema } from '@ui-schema/system/Utils'
import { ValidateFn } from '@ui-schema/system/Validate'
import { List } from 'immutable'
import { FC } from 'react'
import { NextPluginRendererMemo, WidgetPluginProps } from '@ui-schema/react/WidgetEngine'

/**
 * PoC for a replacement for CombiningHandler/ConditionalHandler/ReferencingHandler
 * @todo remove allOf/if handling once Validator supports emitting applied schemas
 */
export const handleSchema = (
    validate: ValidateFn,
    resource: SchemaResource,
    schema: UISchemaMap,
    value: unknown,
): UISchemaMap => {
    let current = schema
    while (current?.get('$ref')) {
        const referenced = resource.findRef(current.get('$ref')!)
        if (referenced) {
            schema = mergeSchema(
                schema,
                handleSchema(validate, resource, referenced.value(), value),
            )
        } else {
            // todo: add storeKeys for more debugging info
            console.log('Missing ref', current?.get('$ref'))
        }
        current = referenced?.value()
    }
    schema = schema.delete('$ref') // remove to prevent accidental applying again

    const allOf = schema.get('allOf') as List<UISchemaMap>
    if (allOf) {
        allOf.forEach((subSchema) => {
            schema = mergeSchema(
                schema,
                handleSchema(validate, resource, subSchema, value),
            )
        })
    }

    const keyIf = schema.get('if')
    if (keyIf) {
        const keyThen = schema.get('then')
        const keyElse = schema.get('else')
        const result = validate(
            // handleSchema(validate, resource, keyIf, value),
            keyIf,
            value,
            {
                ...makeParams(),
                recursive: true,
            },
            {resource: resource},
        )
        if (result.valid) {
            // no errors in schema found, `then` should be rendered
            if (keyThen) {
                schema = mergeSchema(schema, handleSchema(validate, resource, keyThen, value))
            }
        } else {
            // errors in schema found, `else` should be rendered
            if (keyElse) {
                schema = mergeSchema(schema, handleSchema(validate, resource, keyElse, value))
            }
        }
        schema = schema.delete('if').delete('then').delete('else')
    }

    return schema
}

export const ResourceBranchHandler: FC<WidgetPluginProps> = (props) => {
    const {validate, value} = props
    const {resource} = useSchemaResource()

    if (resource && validate) {
        const schema =
            handleSchema(
                validate,
                resource,
                props.schema,
                value,
            )

        return <NextPluginRendererMemo {...props} schema={schema}/>
    }

    return <NextPluginRendererMemo {...props}/>
}
