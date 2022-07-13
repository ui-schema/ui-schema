import { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { WithValue } from '@ui-schema/react/UIStore'

export interface SchemaPlugin {
    handle: (props: Partial<WidgetPluginProps & WithValue>) => Partial<WidgetPluginProps & WithValue>
    noHandle?: (props: Partial<WidgetPluginProps & WithValue>) => Partial<WidgetPluginProps & WithValue>
    should?: (props: Partial<WidgetPluginProps & WithValue>) => boolean
}
