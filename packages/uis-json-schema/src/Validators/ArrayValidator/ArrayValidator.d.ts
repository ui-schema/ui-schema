import { List } from 'immutable'
import { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'
import { ValidatorErrorsType } from '@ui-schema/system/ValidatorErrors'

export const ERROR_DUPLICATE_ITEMS: 'duplicate-items'
export const ERROR_NOT_FOUND_CONTAINS: 'not-found-contains'
export const ERROR_MIN_CONTAINS: 'min-contains'
export const ERROR_MAX_CONTAINS: 'max-contains'
export const ERROR_ADDITIONAL_ITEMS: 'additional-items'

export function validateArrayContent(schema: UISchemaMap | List<UISchemaMap>, value: any, additionalItems?: boolean): {
    err: ValidatorErrorsType
    found: number
}

/**
 * @param {boolean} additionalItems if additional items in a tuple are allowed, or not
 * @param value
 * @param schema must be a list of sub-schemas here, otherwise `additionalItems` doesn't make sense, only for tuple validation
 */
export function validateAdditionalItems(additionalItems: boolean, value: List<any> | any[], schema: List<UISchemaMap>): boolean

export function validateItems(schema: UISchemaMap, value: any): ValidatorErrorsType

export function validateContains(schema: UISchemaMap, value: List<any> | any[]): ValidatorErrorsType

/**
 * Returns `true` when valid (no duplicates) or `false` when found duplicate
 * @param schema
 * @param value
 */
export function validateUniqueItems(schema: UISchemaMap, value: List<any> | any[]): boolean

export interface ArrayValidatorType extends SchemaPlugin {
    should: ({schema}: Partial<WidgetPluginProps>) => boolean
    handle: (
        {schema, value, errors, valid}: Partial<WidgetPluginProps>
    ) => {
        errors: ValidatorErrorsType
        valid: boolean
    }
}

export const arrayValidator: ArrayValidatorType
