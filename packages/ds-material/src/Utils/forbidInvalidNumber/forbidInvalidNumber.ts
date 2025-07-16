import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { schemaTypeIsNumeric } from '@ui-schema/ui-schema/schemaTypeIs'

const numberKeys = new Set([
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',', '-',
    'Backspace', 'Delete',
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
    'Home', 'End',
    'Tab', 'Enter',
    'Numpad0', 'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4',
    'Numpad5', 'Numpad6', 'Numpad7', 'Numpad8', 'Numpad9',
    'NumpadDecimal', 'NumpadSubtract',
    'Decimal',
])

/**
 * Checks for allowed chars in native HTML `input` fields, to disable anything invalid for number fields
 */
export const forbidInvalidNumber = (e: KeyboardEvent, type: SchemaTypesType): boolean => {
    if (
        schemaTypeIsNumeric(type) &&
        !e.altKey && !e.ctrlKey && !e.metaKey &&
        !numberKeys.has(e.key)
    ) {
        e.preventDefault()
        e.stopPropagation()
        return true
    }
    return false
}
