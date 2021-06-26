import { List } from 'immutable'
import { ValidatorPlugin } from "@ui-schema/ui-schema/ValidatorStack/ValidatorPlugin"
import { PluginProps } from "@ui-schema/ui-schema/PluginStack/Plugin"
import { Errors, StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export const ERROR_DUPLICATE_ITEMS: 'duplicate-items'
export const ERROR_NOT_FOUND_CONTAINS: 'not-found-contains'
export const ERROR_MIN_CONTAINS: 'min-contains'
export const ERROR_MAX_CONTAINS: 'max-contains'
export const ERROR_ADDITIONAL_ITEMS: 'additional-items'

export function validateArrayContent(schema: StoreSchemaType | List<StoreSchemaType>, value: any, additionalItems?: boolean): {
    err: Errors
    found: number
}

/**
 * @param {boolean} additionalItems if additional items in a tuple are allowed, or not
 * @param value
 * @param schema must be a list of sub-schemas here, otherwise `additionalItems` doesn't make sense, only for tuple validation
 */
export function validateAdditionalItems(additionalItems: boolean, value: List<any> | any[], schema: List<StoreSchemaType>): boolean

export function validateItems(schema: StoreSchemaType, value: any): Errors

export function validateContains(schema: StoreSchemaType, value: List<any> | any[]): Errors

/**
 * Returns `true` when valid (no duplicates) or `false` when found duplicate
 * @param schema
 * @param value
 */
export function validateUniqueItems(schema: StoreSchemaType, value: List<any> | any[]): boolean

export interface ArrayValidatorType extends ValidatorPlugin {
    should: ({schema}: Partial<PluginProps>) => boolean
    validate: (
        {schema, value, errors, valid}: Partial<PluginProps>
    ) => {
        errors: Errors
        valid: boolean
    }
}

export const arrayValidator: ArrayValidatorType
