import {NumberRenderer, StringRenderer, TextRenderer} from "./Widgets/TextField";
import {Select, SelectMulti} from "./Widgets/Select";
import {BoolRenderer} from "./Widgets/OptionsBoolean";
import {OptionsCheck} from "./Widgets/OptionsCheck";
import {OptionsRadio} from "./Widgets/OptionsRadio";
import {Stepper, Step} from "./Widgets/Stepper";
import {RootRenderer, GroupRenderer} from "./Grid";
import {widgetStack} from "./widgetStack";
import {NumberIconRenderer, StringIconRenderer, TextIconRenderer} from "./Widgets/TextFieldIcon";
import {SimpleList} from "./Widgets/SimpleList";
import {GenericList} from "./Widgets/GenericList";
import {NumberSlider} from "./Widgets/NumberSlider";
import {validators} from '@ui-schema/ui-schema';

const widgets = {
    RootRenderer,
    GroupRenderer,
    widgetStack,
    ErrorFallback: 'todo',
    validators,
    types: {
        string: StringRenderer,
        boolean: BoolRenderer,
        number: NumberRenderer,
    },
    custom: {
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
    },
};

export {widgets};
