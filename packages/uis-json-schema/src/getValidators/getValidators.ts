import { requiredValidator } from '@ui-schema/json-schema/Validators/RequiredValidator'
import { minMaxValidator } from '@ui-schema/json-schema/Validators/MinMaxValidator'
import { typeValidator } from '@ui-schema/json-schema/Validators/TypeValidator'
import { multipleOfValidator } from '@ui-schema/json-schema/Validators/MultipleOfValidator'
import { valueValidatorConst, valueValidatorEnum } from '@ui-schema/json-schema/Validators/ValueValidator'
import { patternValidator } from '@ui-schema/json-schema/Validators/PatternValidator'
import { arrayValidator } from '@ui-schema/json-schema/Validators/ArrayValidator'
import { objectValidator } from '@ui-schema/json-schema/Validators/ObjectValidator'
import { oneOfValidator } from '@ui-schema/json-schema/Validators/OneOfValidator'
import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'

export const getValidators = (): SchemaPlugin[] => [
    requiredValidator,
    minMaxValidator,
    typeValidator,
    multipleOfValidator,
    valueValidatorConst,
    valueValidatorEnum,
    patternValidator,
    arrayValidator,
    objectValidator,
    oneOfValidator,
]
