import { PluginProps } from '@ui-schema/ui-schema/PluginStack/Plugin'

export interface ValidatorPlugin {
    validate: (props: Partial<PluginProps>) => Partial<PluginProps>
    noValidate?: (props: Partial<PluginProps>) => Partial<PluginProps>
    should?: (props: Partial<PluginProps>) => boolean
}
