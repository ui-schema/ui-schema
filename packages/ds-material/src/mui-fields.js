import {NumberRenderer, StringRenderer, TextRenderer} from "./Widgets/TextField";
import {Select, SelectMulti} from "./Widgets/Select";
import {BoolRenderer, OptionsCheck, OptionsRadio} from "./Widgets/Options";
import {Stepper, Step} from "./Widgets/Stepper";
import {RootRenderer, GroupRenderer, SchemaGridHandler} from "./Grid";
import {
    DefaultHandler, ValidityReporter, DependentHandler,
    MinMaxValidator, TypeValidator, MultipleOfValidator,
    ValueValidatorEnum, ValueValidatorConst,
    RequiredValidator, PatternValidator,
    ArrayValidator, ObjectValidator,
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
    ObjectValidator,
    ValidityReporter,
];

const widgets = {
    RootRenderer,
    GroupRenderer,
    widgetStack,
    ErrorFallback: 'todo',
    types: {
        string: StringRenderer,
        bool: BoolRenderer,
        boolean: BoolRenderer,
        number: NumberRenderer,
    },
    custom: {
        Text: TextRenderer,
        OptionsCheck,
        OptionsRadio,
        Select,
        SelectMulti,
        Stepper,
        Step,
    },
};

export {widgets};
