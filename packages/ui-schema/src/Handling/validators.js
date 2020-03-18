import {requiredValidator} from "./RequiredValidator";
import {minMaxValidator} from "./MinMaxValidator";
import {typeValidator} from "./TypeValidator";
import {multipleOfValidator} from "./MultipleOfValidator";
import {valueValidatorConst, valueValidatorEnum} from "./ValueValidator";
import {patternValidator} from "./PatternValidator";
import {arrayValidator} from "./ArrayValidator";
import {objectValidator} from "./ObjectValidator";

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
