import { WidgetPayload } from '@ui-schema/system/Widget'
import { List } from 'immutable'
import { schemaTypeIs, schemaTypeIsNumeric } from '@ui-schema/system/schemaTypeIs'
import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'

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

// export interface RequiredValidatorType extends SchemaPlugin {
//     should: ({requiredList, storeKeys}: WidgetPluginProps) => boolean
//     handle: (props) => {
//         errors: ValidatorErrorsType
//         valid: boolean
//         required: true
//     }
//     noHandle: () => { required: false }
// }

export const requiredValidator: SchemaPlugin<WidgetPayload & { requiredList?: List<string> }> = {
    should: ({requiredList, storeKeys}) => {
        if (requiredList && List.isList(requiredList) && storeKeys) {
            const ownKey = storeKeys.last()
            return typeof ownKey === 'string' && requiredList.contains(ownKey)
        }
        return false
    },
    noHandle: () => ({required: false}),
    handle: ({schema, value, errors, valid}) => {
        if (!schema) return {}
        // @ts-expect-error invalid typing in `UISchemaMap`
        const type = schema.get('type') as string | List<string>
        if (!checkValueExists(type, value)) {
            valid = false
            errors = errors.addError(ERROR_NOT_SET)
        }
        return {errors, valid, required: true}
    },
}
