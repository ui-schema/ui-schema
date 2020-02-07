import {RootRenderer, GroupRenderer, SchemaGridHandler} from "./Grid";
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

const widgets = {
    RootRenderer,
    GroupRenderer,
    widgetStack,
    ErrorFallback: 'todo',
    types: {},
    custom: {},
};

export {widgets};
