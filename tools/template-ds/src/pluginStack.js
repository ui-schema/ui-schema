import {SchemaGridHandler} from "./Grid";
import {
    DefaultHandler, ValidityReporter, DependentHandler,
    ValidatorStack,
    ConditionalHandler, CombiningHandler, ExtractStorePlugin,
} from '@ui-schema/ui-schema';

const pluginStack = [
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
