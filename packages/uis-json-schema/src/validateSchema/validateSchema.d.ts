import { OrderedMap, Map } from 'immutable'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { ValidatorErrorsType } from '@ui-schema/system/ValidatorErrors'

export function validateSchema(
    schema: UISchemaMap,
    value: Map<string | number, any> | OrderedMap<string | number, any>,
    recursively?: boolean,
): ValidatorErrorsType
