import {NumberRenderer, StringRenderer, TextRenderer} from "./Widgets/TextField/TextField";
import {Select, SelectMulti} from "./Widgets/Select/Select";
import {BoolRenderer} from "./Widgets/OptionsBoolean/OptionsBoolean";
import {OptionsCheck} from "./Widgets/OptionsCheck/OptionsCheck";
import {OptionsRadio} from "./Widgets/OptionsRadio/OptionsRadio";
import {Stepper, Step} from "./Widgets/Stepper/Stepper";
import {NumberIconRenderer, StringIconRenderer, TextIconRenderer} from "./Widgets/TextFieldIcon/TextFieldIcon";
import {SimpleList} from "./Widgets/SimpleList/SimpleList";
import {GenericList} from "./Widgets/GenericList/GenericList";
import {NumberSlider} from "./Widgets/NumberSlider/NumberSlider";
import {widgetsBase} from "./widgetsBase";

const widgets = {...widgetsBase};

widgets.types = {
    string: StringRenderer,
    boolean: BoolRenderer,
    number: NumberRenderer,
};

widgets.custom = {
    Text: TextRenderer,
    StringIcon: StringIconRenderer,
    TextIcon: TextIconRenderer,
    NumberIcon: NumberIconRenderer,
    NumberSlider,
    SimpleList,
    GenericList,
    OptionsCheck,
    OptionsRadio,
    Select,
    SelectMulti,
    Stepper,
    Step,
};

export {widgets};
