import { toPointer } from '@ui-schema/json-pointer'
import { ValidatorParams, ValidatorState, ValidatorHandler } from '@ui-schema/json-schema/Validator'
import { List, Map as ImmutableMap, Record } from 'immutable'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export const ERROR_ADDITIONAL_PROPERTIES = 'additional-properties'

export const validateObject = (
    schema: UISchemaMap,
    value: any,
    params: ValidatorParams & ValidatorState,
) => {
    const isRealObject = typeof value !== 'undefined' &&
        ((typeof value === 'object' && value !== null) || ImmutableMap.isMap(value) || Record.isRecord(value)) &&
        !(List.isList(value) || Array.isArray(value))

    const properties = schema.get('properties')
    if (schema.get('additionalProperties') === false && properties && isRealObject) {
        let hasAdditional = false
        const keys = ImmutableMap.isMap(value) || Record.isRecord(value) ? value.toSeq().keySeq() : Object.keys(value)
        const schemaKeys = properties.keySeq()
        keys.forEach(key => {
            // todo: add all invalid additional or change to `for key of value` to break after first invalid
            if (schemaKeys?.indexOf(key) === -1) hasAdditional = true
        })
        if (hasAdditional) {
            params.output.addError({
                error: ERROR_ADDITIONAL_PROPERTIES,
                keywordLocation: toPointer([...params.keywordLocation, 'additionalProperties']),
                instanceLocation: toPointer(params.instanceLocation),
            })
        }
    }

    const propertyNames = schema.get('propertyNames')
    if (propertyNames && isRealObject) {
        const keys = ImmutableMap.isMap(value) || Record.isRecord(value) ? value.toSeq().keySeq() : Object.keys(value)
        keys.forEach(key => {
            params.validate(
                propertyNames.set('type', 'string'),
                key,
                {
                    ...params,
                    keywordLocation: [...params.keywordLocation, 'propertyNames'],
                },
            )
        })
    }

    if (params.recursive && properties) {
        properties.forEach((subSchema, key) => {
            if (!subSchema || typeof key !== 'string') return
            const val = isRealObject ?
                ImmutableMap.isMap(value) || Record.isRecord(value) ?
                    // @ts-expect-error Record typing is not compatible with generic keys
                    value.get(key) :
                    value[key] :
                undefined

            // todo: this must return applied per property, maybe include instanceLocation in returned applied to build a graph for them?
            //       or return a single applied schema and handle schema reduction here already on property level?
            //       as only done when recursive, this would never be used in normal schema layer rendering
            params.validate(
                subSchema,
                val,
                {
                    ...params,
                    parentSchema: schema,
                    keywordLocation: [...params.keywordLocation, 'properties', key],
                    instanceLocation: [...params.instanceLocation, key],
                    instanceKey: key,
                    context: {},
                },
            )
            // params.context ||= {}
            params.context.evaluatedProperties ||= new Map()
            if (!params.context.evaluatedProperties.has(key)) {
                params.context.evaluatedProperties.set(key, [])
            }
            params.context.evaluatedProperties.get(key)!.push(subSchema)
        })
    } else {
        properties?.forEach((subSchema, key) => {
            if (typeof key !== 'string') return
            // params.context ||= {}
            params.context.evaluatedProperties ||= new Map()
            if (!params.context.evaluatedProperties.has(key)) {
                params.context.evaluatedProperties.set(key, [])
            }
            params.context.evaluatedProperties.get(key)!.push(subSchema)
        })
    }
}

export const objectValidator: ValidatorHandler = {
    types: ['object'],
    validate: (schema, value, params) => {
        if (!schema) return
        validateObject(schema, value, params)
    },
}
