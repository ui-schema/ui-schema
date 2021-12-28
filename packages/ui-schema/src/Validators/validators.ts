import { requiredValidator } from '@ui-schema/ui-schema/Validators/RequiredValidator'
import { minMaxValidator } from '@ui-schema/ui-schema/Validators/MinMaxValidator'
import { typeValidator } from '@ui-schema/ui-schema/Validators/TypeValidator'
import { multipleOfValidator } from '@ui-schema/ui-schema/Validators/MultipleOfValidator'
import { valueValidatorConst, valueValidatorEnum } from '@ui-schema/ui-schema/Validators/ValueValidator'
import { patternValidator } from '@ui-schema/ui-schema/Validators/PatternValidator'
import { arrayValidator } from '@ui-schema/ui-schema/Validators/ArrayValidator'
import { objectValidator } from '@ui-schema/ui-schema/Validators/ObjectValidator'
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
