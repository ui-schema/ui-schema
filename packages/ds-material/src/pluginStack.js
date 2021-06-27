import {SchemaGridHandler} from './Grid';
import {
    DefaultHandler, DependentHandler,
    ConditionalHandler, CombiningHandler,
    ReferencingHandler, ExtractStorePlugin,
} from '@ui-schema/ui-schema/Plugins';
import {ValidatorStack} from '@ui-schema/ui-schema/ValidatorStack';
import {ValidityReporter} from '@ui-schema/ui-schema/ValidityReporter';

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
