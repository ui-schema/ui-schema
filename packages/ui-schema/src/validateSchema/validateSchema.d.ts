import { OrderedMap, Map } from 'immutable'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { ValidatorErrorsType } from '@ui-schema/ui-schema/ValidatorErrors'

export function validateSchema(
    schema: StoreSchemaType,
    value: Map<string | number, any> | OrderedMap<string | number, any>,
    recursively?: boolean,
): ValidatorErrorsType

/**
 * @deprecated use `validateSchema` with `recursively: true`
 * @param schema
 * @param value
 */
export function validateSchemaObject(
    schema: StoreSchemaType,
    value: Map<string | number, any> | OrderedMap<string | number, any>
): ValidatorErrorsType
