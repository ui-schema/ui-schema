import { List } from 'immutable'
import { SchemaTypesType } from '@ui-schema/system/CommonTypings'
import { schemaTypeIsNumeric } from '@ui-schema/system/schemaTypeIs'

const numberKeys = List(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',', '-', 'Backspace', 'Delete'])

/**
 * Checks for allowed chars in native HTML `input` fields, to disable anything invalid for number fields
 * @param e
 * @param type
 */
export const forbidInvalidNumber = (e: KeyboardEvent, type: SchemaTypesType): boolean => {
    if (
        schemaTypeIsNumeric(type) &&
        !e.altKey && !e.ctrlKey && !e.metaKey &&
        !numberKeys.includes(e.key)
    ) {
        e.preventDefault()
        e.stopPropagation()
        return true
    }
    return false
}
