import { SchemaGridHandler } from './Grid'
import {
    DefaultHandler, DependentHandler,
    ConditionalHandler, CombiningHandler,
    ReferencingHandler, ExtractStorePlugin,
} from '@ui-schema/ui-schema/Plugins'
import { PluginSimpleStack } from '@ui-schema/ui-schema/PluginSimpleStack'
import { ValidityReporter } from '@ui-schema/ui-schema/ValidityReporter'
import { ComponentPluginType } from '@ui-schema/ui-schema'

export const pluginStack: ComponentPluginType[] = [
    ReferencingHandler,
    SchemaGridHandler,
    ExtractStorePlugin,
    CombiningHandler,
    DefaultHandler,
    DependentHandler,
    ConditionalHandler,
    PluginSimpleStack,
    ValidityReporter,
]
