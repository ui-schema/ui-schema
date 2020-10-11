import { OrderedMap, Map } from 'immutable'
import { ValidatorErrorsType } from '@ui-schema/ui-schema/ValidatorStack/ValidatorErrors'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export function validateSchema(
    schema: StoreSchemaType,
    value: Map<string | number, any> | OrderedMap<string | number, any>
): ValidatorErrorsType

export function validateSchemaObject(
    schema: StoreSchemaType,
    value: Map<string | number, any> | OrderedMap<string | number, any>
): ValidatorErrorsType
