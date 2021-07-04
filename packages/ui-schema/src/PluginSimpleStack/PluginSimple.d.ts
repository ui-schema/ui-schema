import { PluginProps } from '@ui-schema/ui-schema/PluginStack/Plugin'

export interface PluginSimple {
    handle: (props: Partial<PluginProps>) => Partial<PluginProps>
    noHandle?: (props: Partial<PluginProps>) => Partial<PluginProps>
    should?: (props: Partial<PluginProps>) => boolean
}
