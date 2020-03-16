import {RootRenderer, GroupRenderer} from "./Grid";
import {pluginStack} from "./pluginStack";
import {validators} from '@ui-schema/ui-schema';

const widgetsBase = {
    ErrorFallback: 'todo',
    RootRenderer,  // wraps the whole editor
    GroupRenderer, // wraps any `object` that has no custom widget
    pluginStack,   // widget plugin system
    validators,    // validator functions
    types: {/* define native JSON-schema type widgets */},
    custom: {/* define custom widgets */},
};

export {widgetsBase};
