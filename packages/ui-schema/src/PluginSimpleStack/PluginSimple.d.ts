import { PluginProps } from '@ui-schema/ui-schema/PluginStack/Plugin'
import { WithValue } from '@ui-schema/ui-schema/UIStore'

export interface PluginSimple {
    handle: (props: Partial<PluginProps & WithValue>) => Partial<PluginProps & WithValue>
    noHandle?: (props: Partial<PluginProps & WithValue>) => Partial<PluginProps & WithValue>
    should?: (props: Partial<PluginProps & WithValue>) => boolean
}
