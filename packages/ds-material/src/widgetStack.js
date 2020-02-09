import {SchemaGridHandler} from "./Grid";
import {
    DefaultHandler, ValidityReporter, DependentHandler,
    MinMaxValidator, TypeValidator, MultipleOfValidator,
    ValueValidatorEnum, ValueValidatorConst,
    RequiredValidator, PatternValidator, ArrayValidator,
} from "@ui-schema/ui-schema";

const widgetStack = [
    DependentHandler,
    SchemaGridHandler,
    DefaultHandler,
    RequiredValidator,
    MinMaxValidator,
    TypeValidator,
    MultipleOfValidator,
    ValueValidatorConst,
    ValueValidatorEnum,
    PatternValidator,
    ArrayValidator,
    ValidityReporter,
];

export {widgetStack};
