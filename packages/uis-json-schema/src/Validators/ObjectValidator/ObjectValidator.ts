import { toPointer } from '@ui-schema/json-pointer'
import { ValidatorParams, ValidatorState, ValidatorHandler } from '@ui-schema/json-schema/Validator'
import { List, Map, Record } from 'immutable'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export const ERROR_ADDITIONAL_PROPERTIES = 'additional-properties'

export const validateObject = (
    schema: UISchemaMap,
    value: any,
    params: ValidatorParams,
    state: ValidatorState,
): void => {
    const isRealObject = typeof value !== 'undefined' &&
        ((typeof value === 'object' && value !== null) || Map.isMap(value) || Record.isRecord(value)) &&
        !(List.isList(value) || Array.isArray(value))

    const properties = schema.get('properties')
    if (schema.get('additionalProperties') === false && properties && isRealObject) {
        let hasAdditional = false
        const keys = Map.isMap(value) || Record.isRecord(value) ? value.toSeq().keySeq() : Object.keys(value)
        const schemaKeys = properties.keySeq()
        keys.forEach(key => {
            // todo: add all invalid additional or change to `for key of value` to break after first invalid
            if (schemaKeys?.indexOf(key) === -1) hasAdditional = true
        })
        if (hasAdditional) {
            state.output.addError({
                error: ERROR_ADDITIONAL_PROPERTIES,
                keywordLocation: toPointer([...params.keywordLocation, 'additionalProperties']),
                instanceLocation: toPointer(params.instanceLocation),
            })
        }
    }

    const propertyNames = schema.get('propertyNames')
    if (propertyNames && isRealObject) {
        const keys = Map.isMap(value) || Record.isRecord(value) ? value.toSeq().keySeq() : Object.keys(value)
        keys.forEach(key => {
            state.validate(
                propertyNames.set('type', 'string'),
                key,
                {
                    ...params,
                    keywordLocation: [...params.keywordLocation, 'propertyNames'],
                },
                state,
            )
        })
    }

    if (params.recursive && properties) {
        properties.forEach((subSchema, key) => {
            if (!subSchema) return
            const val = isRealObject ?
                Map.isMap(value) || Record.isRecord(value) ?
                    // @ts-expect-error Record typing is not compatible with generic keys
                    value.get(key) :
                    value[key] :
                undefined

            // todo: this must return applied per property, maybe include instanceLocation in returned applied to build a graph for them?
            state.validate(
                subSchema,
                val,
                {
                    ...params,
                    parentSchema: schema,
                    keywordLocation: [...params.keywordLocation, 'properties', key],
                    instanceLocation: [...params.instanceLocation, key],
                    instanceKey: key,
                },
                state,
            )
        })
    }
}

export const objectValidator: ValidatorHandler = {
    types: ['object'],
    validate: (schema, value, params, state) => {
        if (!schema) return
        validateObject(schema, value, params, state)
    },
}
