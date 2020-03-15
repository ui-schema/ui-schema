import {requiredValidator} from "./RequiredValidator";
import {minMaxValidator} from "./MinMaxValidator";
import {typeValidator} from "./TypeValidator";
import {multipleOfValidator} from "./MultipleOfValidator";
import {valueValidatorConst, valueValidatorEnum} from "./ValueValidator";
import {patternValidator} from "./PatternValidator";
import {arrayValidator} from "./ArrayValidator";

export const validators = [
    requiredValidator,
    minMaxValidator,
    typeValidator,
    multipleOfValidator,
    valueValidatorConst,
    valueValidatorEnum,
    patternValidator,
    arrayValidator,
];
