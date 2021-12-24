import { requiredValidator } from './RequiredValidator/RequiredValidator'
import { minMaxValidator } from './MinMaxValidator/MinMaxValidator'
import { typeValidator } from './TypeValidator/TypeValidator'
import { multipleOfValidator } from './MultipleOfValidator/MultipleOfValidator'
import { valueValidatorConst, valueValidatorEnum } from './ValueValidator'
import { patternValidator } from './PatternValidator/PatternValidator'
import { arrayValidator } from './ArrayValidator/ArrayValidator'
import { objectValidator } from './ObjectValidator/ObjectValidator'
import { oneOfValidator } from '@ui-schema/ui-schema/Validators/OneOfValidator'
import { PluginSimple } from '@ui-schema/ui-schema/PluginSimpleStack'

export const validators: PluginSimple[] = [
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
