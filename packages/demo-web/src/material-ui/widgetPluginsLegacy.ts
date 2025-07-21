import { SchemaGridHandler } from '@ui-schema/ds-material/Grid'
import { requiredPlugin } from '@ui-schema/json-schema/RequiredPlugin'
import { validatorPlugin } from '@ui-schema/json-schema/ValidatorPlugin'
import { schemaPluginsAdapterBuilder } from '@ui-schema/react/SchemaPluginsAdapter'
import { WidgetPluginType } from '@ui-schema/react/WidgetEngine'
import { DefaultHandler } from '@ui-schema/react/DefaultHandler'
import { CombiningHandler } from '@ui-schema/react/CombiningHandler'
import { ConditionalHandler } from '@ui-schema/react/ConditionalHandler'
import { DependentHandler } from '@ui-schema/react/DependentHandler'
import { ReferencingHandler } from '@ui-schema/react/ReferencingHandler'
import { ValidityReporter } from '@ui-schema/react/ValidityReporter'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'

export const widgetPluginsLegacy: WidgetPluginType[] = [
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    ReferencingHandler,// must be before AND maybe after combining/conditional?
    SchemaGridHandler,// todo: Grid must be after e.g. ConditionalHandler, but why was it this high? wasn't that because of e.g. conditional object grids?
    // ExtractStorePlugin,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    CombiningHandler,
    DefaultHandler,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    DependentHandler,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    ConditionalHandler,
    // SchemaPluginsAdapter,
    schemaPluginsAdapterBuilder([
        validatorPlugin,
        requiredPlugin,
    ]),
    ValidityReporter,
    WidgetRenderer as WidgetPluginType,
]
