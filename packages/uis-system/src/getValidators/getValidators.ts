import { requiredValidator } from '@ui-schema/system/Validators/RequiredValidator'
import { minMaxValidator } from '@ui-schema/system/Validators/MinMaxValidator'
import { typeValidator } from '@ui-schema/system/Validators/TypeValidator'
import { multipleOfValidator } from '@ui-schema/system/Validators/MultipleOfValidator'
import { valueValidatorConst, valueValidatorEnum } from '@ui-schema/system/Validators/ValueValidator'
import { patternValidator } from '@ui-schema/system/Validators/PatternValidator'
import { arrayValidator } from '@ui-schema/system/Validators/ArrayValidator'
import { objectValidator } from '@ui-schema/system/Validators/ObjectValidator'
import { oneOfValidator } from '@ui-schema/system/Validators/OneOfValidator'
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
