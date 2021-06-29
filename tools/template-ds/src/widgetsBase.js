import {RootRenderer, GroupRenderer} from "./Grid";
import {pluginStack} from "./pluginStack";
import {WidgetRenderer} from '@ui-schema/ui-schema/WidgetRenderer';
import {validators} from '@ui-schema/ui-schema/Validators/validators';

const widgetsBase = {
    ErrorFallback: 'todo',
    RootRenderer,   // wraps the whole generator
    GroupRenderer,  // wraps any `object` that has no custom widget
    WidgetRenderer, // final rendering and matching of the Widget component
    pluginStack,    // widget plugin system
    pluginSimpleStack: validators, // simple plugins (e.g. validator functions)
    types: {/* define native JSON-schema type widgets */},
    custom: {/* define custom widgets */},
};

export {widgetsBase};
