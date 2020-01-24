import {NumberRenderer, StringRenderer, TextRenderer} from "./Widgets/TextField";
import {Select, SelectMulti} from "./Widgets/Select";
import {BoolRenderer, OptionsCheck, OptionsRadio} from "./Widgets/Options";
import {Stepper, Step} from "./Widgets/Stepper";
import {RootRenderer, GroupRenderer, widgetStack} from "./Grid";

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
