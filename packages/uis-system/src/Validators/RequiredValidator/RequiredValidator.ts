import { List } from 'immutable'
import { schemaTypeIs, schemaTypeIsNumeric } from '@ui-schema/system/schemaTypeIs'
import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'
import { ValidatorErrorsType } from '@ui-schema/system/ValidatorErrors'
import { SchemaPluginProps } from '@ui-schema/system/SchemaPlugin'
import { StoreKeys } from '@ui-schema/system/ValueStore'

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

export interface RequiredValidatorType extends SchemaPlugin {
    should: ({requiredList, storeKeys}: SchemaPluginProps & { requiredList?: StoreKeys }) => boolean
    handle: (props) => {
        errors: ValidatorErrorsType
        valid: boolean
        required: true
    }
    noHandle: () => { required: false }
}

export const requiredValidator: RequiredValidatorType = {
    should: ({requiredList, storeKeys}) => {
        if (requiredList && List.isList(requiredList)) {
            return requiredList.contains(storeKeys.last())
        }
        return false
    },
    noHandle: () => ({required: false}),
    handle: ({schema, value, errors, valid}) => {
        const type = schema.get('type')
        if (!checkValueExists(type, value)) {
            valid = false
            errors = errors.addError(ERROR_NOT_SET)
        }
        return {errors, valid, required: true}
    },
}
