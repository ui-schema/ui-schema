import {StringRenderer, TextRenderer, NumberRenderer} from "./Widgets/TextField";
import {BoolRenderer} from "./Widgets/OptionsBoolean";
import {RootRenderer, GroupRenderer} from "./Grid";
import {widgetStack} from "./widgetStack";

const widgets = {
    RootRenderer,
    GroupRenderer,
    widgetStack,
    ErrorFallback: 'todo',
    types: {
        string: StringRenderer,
        number: NumberRenderer,
        boolean: BoolRenderer,
    },
    custom: {
        Text: TextRenderer
    },
};

export {widgets};
