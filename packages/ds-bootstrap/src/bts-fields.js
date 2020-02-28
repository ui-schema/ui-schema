import {StringRenderer, TextRenderer, NumberRenderer} from "./Widgets/TextField";
import {RootRenderer, GroupRenderer} from "./Grid";
import {widgetStack} from "./widgetStack";

const widgets = {
    RootRenderer,
    GroupRenderer,
    widgetStack,
    ErrorFallback: 'todo',
    types: {
        string: StringRenderer,
        number: NumberRenderer
    },
    custom: {
        Text: TextRenderer
    },
};

export {widgets};
