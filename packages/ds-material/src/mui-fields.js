import {NumberRenderer, StringRenderer, TextRenderer} from "./Widgets/TextField";
import {Select, SelectMulti} from "./Widgets/Select";
import {BoolRenderer, OptionsCheck, OptionsRadio} from "./Widgets/Options";
import {Stepper, Step} from "./Widgets/Stepper";
import {RootRenderer, GroupRenderer, SchemaGridHandler} from "./Grid";
import {
    DefaultHandler, ValidityReporter,
    MinMaxValidator, TypeValidator, MultipleOfValidator, ValueValidatorEnum, ValueValidatorConst, RequiredValidator, PatternValidator, ArrayValidator,
} from "@ui-schema/ui-schema";

const widgetStack = [
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
