import {SchemaGridHandler} from "./Grid";
import {
    DefaultHandler, ValidityReporter, DependentHandler,
    PluginSimpleStack,
    ConditionalHandler, CombiningHandler, ExtractStorePlugin,
} from '@ui-schema/ui-schema';

const pluginStack = [
    SchemaGridHandler,
    ExtractStorePlugin,
    CombiningHandler,
    DefaultHandler,
    DependentHandler,
    ConditionalHandler,
    PluginSimpleStack,
    ValidityReporter,
];

export {pluginStack};
