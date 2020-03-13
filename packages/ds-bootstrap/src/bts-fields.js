import {validators} from "@ui-schema/ui-schema";
import {StringRenderer, TextRenderer, NumberRenderer} from "./Widgets/TextField";
import {BoolRenderer} from "./Widgets/OptionsBoolean";
import {OptionsRadio} from "./Widgets/OptionsRadio";
import {OptionsCheck} from "./Widgets/OptionsCheck";
import {Select} from "./Widgets/Select";
import {RootRenderer, GroupRenderer} from "./Grid";
import {pluginStack} from "./pluginStack";

const widgets = {
    RootRenderer,
    GroupRenderer,
    pluginStack: pluginStack,
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
        OptionsCheck,
        Select
    },
};

export {widgets};
