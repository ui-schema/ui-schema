import { List, Map, Record } from 'immutable'
import { createValidatorErrors, ValidatorErrorsType } from '@ui-schema/system/ValidatorErrors'
import { checkValueExists, ERROR_NOT_SET } from '../RequiredValidator'
import { validateSchema } from '@ui-schema/json-schema/validateSchema'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'

export const ERROR_ADDITIONAL_PROPERTIES = 'additional-properties'

export const validateObject = (schema: UISchemaMap, value: any, recursively: boolean = false): ValidatorErrorsType => {
    let err = createValidatorErrors()
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
            err = err.addError(ERROR_ADDITIONAL_PROPERTIES)
        }
    }

    const propertyNames = schema.get('propertyNames')
    if (propertyNames && isRealObject) {
        const keys = Map.isMap(value) || Record.isRecord(value) ? value.toSeq().keySeq() : Object.keys(value)
        keys.forEach(key => {
            const tmp_err = validateSchema(propertyNames.set('type', 'string'), key, recursively)
            if (tmp_err.hasError()) {
                err = err.addErrors(tmp_err)
            }
        })
    }

    if (recursively && properties) {
        properties.forEach((subSchema, key) => {
            if (!subSchema) return
            // todo check why the `unknown` conversion is here needed with the new nested OrderedMap typing
            const subTypeType = subSchema.get('type') as unknown as string | List<string> | string[]
            const val = isRealObject ?
                Map.isMap(value) || Record.isRecord(value) ?
                    // @ts-ignore
                    value.get(key) :
                    value[key] :
                undefined
            const required = schema.get('required')
            if (required?.contains(key as string) && !checkValueExists(subTypeType, val)) {
                err = err.addError(ERROR_NOT_SET)
                return
            }

            const t = validateSchema(subSchema, val, recursively)
            if (t.hasError()) {
                err = err.addErrors(t)
            }
        })
    }

    return err
}

export const objectValidator: SchemaPlugin = {
    handle: ({schema, value, errors, valid}) => {
        const objectErrors = validateObject(schema, value)
        if (objectErrors?.hasError()) {
            valid = false
            errors = errors.addErrors(objectErrors)
        }
        return {errors, valid}
    },
}
