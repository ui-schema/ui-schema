import {validators} from "@ui-schema/ui-schema";
import {StringRenderer, TextRenderer, NumberRenderer} from "./Widgets/TextField";
import {BoolRenderer} from "./Widgets/OptionsBoolean";
import {OptionsRadio} from "./Widgets/OptionsRadio";
import {OptionsCheck} from "./Widgets/OptionsCheck";
import {RootRenderer, GroupRenderer} from "./Grid";
import {widgetStack} from "./widgetStack";

const widgets = {
    RootRenderer,
    GroupRenderer,
    widgetStack,
    validators,
    ErrorFallback: 'todo',
    types: {
        string: StringRenderer,
        number: NumberRenderer,
        boolean: BoolRenderer,
    },
    custom: {
        Text: TextRenderer,
        OptionsCheck,
        OptionsRadio,
    },
};

export {widgets};
