import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'
import { WidgetPayload } from '@ui-schema/system/Widget'
import { List, Map } from 'immutable'
import { schemaTypeIs, schemaTypeIsNumeric } from '@ui-schema/system/schemaTypeIs'

export const ERROR_NOT_SET = 'required-not-set'

export const checkValueExists = (type: string | List<string> | string[], value: any): boolean => {
    const valType = typeof value

    if (valType === 'undefined') {
        return false
    }

    if (schemaTypeIs(type, 'string') && valType === 'string') {
        return value !== ''
    } else if (valType === 'string' && schemaTypeIsNumeric(type)) {
        // 0 is also a valid number, so not checking for false here
        return value !== ''
    }

    return true
}

// todo: remove this once the new required validator works like previously
/**
 * @deprecated
 */
export const requiredValidator: SchemaPlugin<WidgetPayload> = {
    handle: ({parentSchema, schema, storeKeys, value, errors, valid}) => {
        const requiredList = parentSchema?.get('required') as List<string> | undefined
        if (!schema || !requiredList || !List.isList(requiredList) || !storeKeys) {
            return {required: false}
        }
        const ownKey = storeKeys.last()
        if (typeof ownKey !== 'string' || !requiredList.contains(ownKey)) {
            return {required: false}
        }
        // @ts-expect-error invalid typing in `UISchemaMap`
        const type = schema.get('type') as string | List<string>
        if (!checkValueExists(type, value)) {
            valid = false
            errors = (errors || List([])).push(Map({error: ERROR_NOT_SET}))
        }
        return {errors, valid, required: true}
    },
}
