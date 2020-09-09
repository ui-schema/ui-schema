import { OrderedMap, Map } from 'immutable'
import { ValidatorErrorsType } from "@ui-schema/ui-schema/ValidityReporter"

export function validateSchema<K>(
    schema: Map<K, undefined> | OrderedMap<K, undefined>,
    value: Map<K, undefined> | OrderedMap<K, undefined>
): ValidatorErrorsType

export function validateSchemaObject<K>(
    schema: Map<K, undefined> | OrderedMap<K, undefined>,
    value: Map<K, undefined> | OrderedMap<K, undefined>
): ValidatorErrorsType
