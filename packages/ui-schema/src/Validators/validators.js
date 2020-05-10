import {requiredValidator} from "./RequiredValidator/RequiredValidator";
import {minMaxValidator} from "./MinMaxValidator/MinMaxValidator";
import {typeValidator} from "./TypeValidator/TypeValidator";
import {multipleOfValidator} from "./MultipleOfValidator/MultipleOfValidator";
import {valueValidatorConst, valueValidatorEnum} from "./ValueValidator/ValueValidator";
import {patternValidator} from "./PatternValidator/PatternValidator";
import {arrayValidator} from "./ArrayValidator/ArrayValidator";
import {objectValidator} from "./ObjectValidator/ObjectValidator";

export const validators = [
    requiredValidator,
    minMaxValidator,
    typeValidator,
    multipleOfValidator,
    valueValidatorConst,
    valueValidatorEnum,
    patternValidator,
    arrayValidator,
    objectValidator,
];
