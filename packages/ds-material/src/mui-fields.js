import {NumberRenderer, StringRenderer, TextRenderer} from "./Field/TestField";
import {Select, SelectMulti} from "./Field/Select";
import {BoolRenderer, OptionsCheck, OptionsRadio} from "./Field/Options";
import {RootRenderer, GroupRenderer, WidgetRenderer} from "./Grid";

const widgets = {
    RootRenderer,
    GroupRenderer,
    WidgetRenderer,
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
    },
};

export {widgets};
