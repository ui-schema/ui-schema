import {NumberRenderer, StringRenderer, TextRenderer} from "./Widgets/TextField";
import {Select, SelectMulti} from "./Widgets/Select";
import {BoolRenderer} from "./Widgets/OptionsBoolean";
import {OptionsCheck} from "./Widgets/OptionsCheck";
import {OptionsRadio} from "./Widgets/OptionsRadio";
import {SimpleList} from "./Widgets/SimpleList";
import {RootRenderer, GroupRenderer} from "./Grid";
import {pluginStack} from "./pluginStack";
import {validators} from '@ui-schema/ui-schema/Validators/validators';

export const widgets = {
    ErrorFallback: 'todo',
    RootRenderer,
    GroupRenderer,
    pluginStack,
    validators,
    types: {
        string: StringRenderer,
        boolean: BoolRenderer,
        number: NumberRenderer,
        integer: NumberRenderer,
    },
    custom: {
        Text: TextRenderer,
        SimpleList,
        OptionsCheck,
        OptionsRadio,
        Select,
        SelectMulti,
    }
}
