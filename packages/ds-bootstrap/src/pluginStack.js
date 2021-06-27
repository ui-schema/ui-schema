import {SchemaGridHandler} from './Grid';
import {
    DefaultHandler, ValidityReporter, DependentHandler,
    ValidatorStack,
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
    ValidatorStack,
    ValidityReporter,
];

export {pluginStack};
