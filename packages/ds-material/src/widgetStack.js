import {SchemaGridHandler} from "./Grid";
import {
    DefaultHandler, ValidityReporter, DependentHandler,
    MinMaxValidator, TypeValidator, MultipleOfValidator,
    ValueValidatorEnum, ValueValidatorConst,
    RequiredValidator, PatternValidator, ArrayValidator,
    ConditionalHandler,
} from "@ui-schema/ui-schema";

const widgetStack = [
    SchemaGridHandler,
    DefaultHandler,
    DependentHandler,
    ConditionalHandler,
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
