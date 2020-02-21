import {NumberRenderer, StringRenderer, TextRenderer} from "./Widgets/TextField";
import {Select, SelectMulti} from "./Widgets/Select";
import {BoolRenderer, OptionsCheck, OptionsRadio} from "./Widgets/Options";
import {Stepper, Step} from "./Widgets/Stepper";
import {RootRenderer, GroupRenderer} from "./Grid";
import {widgetStack} from "./widgetStack";

const widgets = {
    RootRenderer,
    GroupRenderer,
    widgetStack,
    ErrorFallback: 'todo',
    types: {
         string: StringRenderer, /*
         boolean: BoolRenderer,
         number: NumberRenderer,*/
    },
    custom: {
         Text: TextRenderer/*,
         OptionsRadio ,
         Select,
         SelectMulti,
         Stepper,
         Step, */
    },
};

export {widgets};
