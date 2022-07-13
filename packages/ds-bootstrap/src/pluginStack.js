import {SchemaGridHandler} from './Grid';
import {
    DefaultHandler, DependentHandler,
    ConditionalHandler, CombiningHandler,
    ReferencingHandler, ExtractStorePlugin,
} from '@ui-schema/ui-schema/Plugins';
import {ValidityReporter} from '@ui-schema/ui-schema/ValidityReporter';
import {PluginSimpleStack} from '@ui-schema/ui-schema/PluginSimpleStack';

export const widgetPlugins = [
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
