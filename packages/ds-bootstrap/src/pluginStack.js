import {SchemaGridHandler} from './Grid';
import {
    DefaultHandler, ValidityReporter, DependentHandler,
    PluginSimpleStack,
    ConditionalHandler, CombiningHandler, ExtractStorePlugin,
} from '@ui-schema/ui-schema';
import {ReferencingHandler} from '@ui-schema/ui-schema/Plugins/ReferencingHandler';

const pluginStack = [
    ReferencingHandler,
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
