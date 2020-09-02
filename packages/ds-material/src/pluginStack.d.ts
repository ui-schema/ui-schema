import { EditorPluginType } from '@ui-schema/ui-schema/EditorPlugin'

/**
 * Plugin stack contains:
 * - SchemaGridHandler
 * - CombiningHandler
 * - DefaultHandler
 * - DependentHandler
 * - ConditionalHandler
 * - ValidatorStack
 * - ValidityReporter
 */
export const pluginStack: Array<EditorPluginType>
