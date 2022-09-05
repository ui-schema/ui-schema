import { WidgetPluginType } from '@ui-schema/react/WidgetEngine'

/**
 * Plugin stack contains:
 * - SchemaGridHandler
 * - CombiningHandler
 * - DefaultHandler
 * - DependentHandler
 * - ConditionalHandler
 * - PluginSimpleStack
 * - ValidityReporter
 */
export const widgetPlugins: Array<WidgetPluginType>
