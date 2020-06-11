import {StringRenderer, TextRenderer, NumberRenderer} from "./Widgets/TextField";
import {BoolRenderer} from "./Widgets/OptionsBoolean";
import {OptionsRadio} from "./Widgets/OptionsRadio";
import {OptionsCheck} from "./Widgets/OptionsCheck";
import {Select, SelectMulti} from "./Widgets/Select";
import {SimpleList} from "./Widgets/SimpleList";
import {widgetsBase} from "./widgetsBase";

const widgets = {...widgetsBase};

widgets.types = {
        string: StringRenderer,
        number: NumberRenderer,
        boolean: BoolRenderer,
};

widgets.custom = {
        Text: TextRenderer,
        OptionsRadio,
        OptionsCheck,
        Select,
        SelectMulti,
        SimpleList
};

export {widgets};
