import { OrderedMap, List } from 'immutable'
import { ValidatorPlugin } from "@ui-schema/ui-schema/Validators/ValidatorPlugin"
import { EditorPluginProps } from "@ui-schema/ui-schema/EditorPlugin"

export const ERROR_DUPLICATE_ITEMS = 'duplicate-items'
export const ERROR_NOT_FOUND_CONTAINS = 'not-found-contains'
export const ERROR_ADDITIONAL_ITEMS = 'additional-items'

export function validateArrayContent(schema: OrderedMap<{}, undefined> | List<any>, value: any, additionalItems?: boolean, find?: boolean): List<any>

/**
 * @param {boolean} additionalItems if additional items in a tuple are allowed, or not
 * @param value
 * @param schema must be a list of sub-schemas here, otherwise `additionalItems` doesn't make sense, only for tuple validation
 */
export function validateAdditionalItems(additionalItems: boolean, value: List<any> | any[], schema: List<any>): boolean

export function validateItems(schema: OrderedMap<{}, undefined>, value: any): List<any>

export function validateContains(schema: OrderedMap<{}, undefined>, value: List<any> | any[]): List<any>

/**
 * Returns `true` when valid (no duplicates) or `false` when found duplicate
 * @param schema
 * @param value
 */
export function validateUniqueItems(schema: OrderedMap<{}, undefined>, value: List<any> | any[]): boolean

export interface ArrayValidatorType extends ValidatorPlugin {
    should: ({schema}: Partial<EditorPluginProps>) => boolean
    validate: (
        {schema, value, errors, valid}: Partial<EditorPluginProps>
    ) => {
        errors: List<any>
        valid: boolean
    }
}

export const arrayValidator: ArrayValidatorType
