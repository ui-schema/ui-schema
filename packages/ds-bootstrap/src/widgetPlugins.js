import {SchemaGridHandler} from './Grid';
import {ReferencingHandler} from '@ui-schema/react/Decorators/ReferencingHandler';
// import {ExtractStorePlugin} from '@ui-schema/react/ExtractStorePlugin';
import {CombiningHandler} from '@ui-schema/react/Decorators/CombiningHandler';
import {DefaultHandler} from '@ui-schema/react/Decorators/DefaultHandler';
import {DependentHandler} from '@ui-schema/react/Decorators/DependentHandler';
import {ConditionalHandler} from '@ui-schema/react/Decorators/ConditionalHandler';
import {SchemaPluginsAdapter} from '@ui-schema/react/Decorators/SchemaPluginsAdapter';
import {ValidityReporter} from '@ui-schema/react/ValidityReporter';

export const widgetPlugins = [
    ReferencingHandler,
    SchemaGridHandler,
    // ExtractStorePlugin,
    CombiningHandler,
    DefaultHandler,
    DependentHandler,
    ConditionalHandler,
    SchemaPluginsAdapter,
    ValidityReporter,
];
