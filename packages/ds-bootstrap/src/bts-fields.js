import {StringRenderer, TextRenderer, NumberRenderer} from "./Widgets/TextField/TextField";
import {BoolRenderer} from "./Widgets/OptionsBoolean/OptionsBoolean";
import {OptionsRadio} from "./Widgets/OptionsRadio/OptionsRadio";
import {OptionsCheck} from "./Widgets/OptionsCheck/OptionsCheck";
import {Select, SelectMulti} from "./Widgets/Select/Select";
import {SimpleList} from "./Widgets/SimpleList/SimpleList";
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
