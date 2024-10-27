import { SchemaGridHandler } from '@ui-schema/ds-material/Grid'
import { WidgetPluginType } from '@ui-schema/react/WidgetEngine'
import { DefaultHandler } from '@ui-schema/react-json-schema/DefaultHandler'
import { CombiningHandler } from '@ui-schema/react-json-schema/CombiningHandler'
import { ConditionalHandler } from '@ui-schema/react-json-schema/ConditionalHandler'
import { DependentHandler } from '@ui-schema/react-json-schema/DependentHandler'
import { ReferencingHandler } from '@ui-schema/react-json-schema/ReferencingHandler'
import { SchemaPluginsAdapter } from '@ui-schema/react/SchemaPluginsAdapter'
import { ValidityReporter } from '@ui-schema/react/ValidityReporter'
import { getValidators } from '@ui-schema/json-schema/getValidators'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'

export const plugins = (): {
    widgetPlugins: WidgetPluginType[]
    schemaPlugins: SchemaPlugin[]
} => {
    const widgetPlugins: WidgetPluginType[] = [
        ReferencingHandler,// must be before AND maybe after combining/conditional?
        SchemaGridHandler,// todo: Grid must be after e.g. ConditionalHandler, but why was it this high? wasn't that because of e.g. conditional object grids?
        // ExtractStorePlugin,
        CombiningHandler,
        DefaultHandler,
        DependentHandler,
        ConditionalHandler,
        SchemaPluginsAdapter,
        ValidityReporter,
        WidgetRenderer,
    ]

    return {
        widgetPlugins,
        schemaPlugins: getValidators(),
    }
}
