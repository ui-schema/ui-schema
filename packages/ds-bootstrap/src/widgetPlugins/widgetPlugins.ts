import { WidgetPluginType } from '@ui-schema/react/WidgetEngine'
import { SchemaGridHandler } from '@ui-schema/ds-bootstrap/Grid'
import { ReferencingHandler } from '@ui-schema/react-json-schema/ReferencingHandler'
// import {ExtractStorePlugin} from '@ui-schema/react/ExtractStorePlugin';
import { CombiningHandler } from '@ui-schema/react-json-schema/CombiningHandler'
import { DefaultHandler } from '@ui-schema/react-json-schema/DefaultHandler'
import { DependentHandler } from '@ui-schema/react-json-schema/DependentHandler'
import { ConditionalHandler } from '@ui-schema/react-json-schema/ConditionalHandler'
import { SchemaPluginsAdapter } from '@ui-schema/react/SchemaPluginsAdapter'
import { ValidityReporter } from '@ui-schema/react/ValidityReporter'

export const widgetPlugins: WidgetPluginType[] = [
    ReferencingHandler,
    SchemaGridHandler,
    // ExtractStorePlugin,
    CombiningHandler,
    DefaultHandler,
    DependentHandler,
    ConditionalHandler,
    SchemaPluginsAdapter,
    ValidityReporter,
]
