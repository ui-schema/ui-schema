import {SchemaGridHandler} from './Grid';
import {
    DefaultHandler, DependentHandler,
    ConditionalHandler, CombiningHandler,
    ReferencingHandler, ExtractStorePlugin,
} from '@ui-schema/ui-schema/Plugins';
import {PluginSimpleStack} from '@ui-schema/ui-schema/PluginSimpleStack';
import {ValidityReporter} from '@ui-schema/ui-schema/ValidityReporter';

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
