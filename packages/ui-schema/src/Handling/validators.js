import {RequiredValidator} from "./RequiredValidator";
import {MinMaxValidator} from "./MinMaxValidator";
import {TypeValidator} from "./TypeValidator";
import {MultipleOfValidator} from "./MultipleOfValidator";
import {ValueValidatorConst, ValueValidatorEnum} from "./ValueValidator";
import {PatternValidator} from "./PatternValidator";
import {ArrayValidator} from "./ArrayValidator";

export const validators = [
    RequiredValidator,
    MinMaxValidator,
    TypeValidator,
    MultipleOfValidator,
    ValueValidatorConst,
    ValueValidatorEnum,
    PatternValidator,
    ArrayValidator,
];
