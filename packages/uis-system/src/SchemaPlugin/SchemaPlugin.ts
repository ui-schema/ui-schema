import { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { WithValue } from '@ui-schema/react/UIStore'

export interface SchemaPlugin {
    handle: (props: WidgetPluginProps & WithValue) => Partial<WidgetPluginProps & WithValue>
    noHandle?: (props: WidgetPluginProps & WithValue) => Partial<WidgetPluginProps & WithValue>
    should?: (props: WidgetPluginProps & WithValue) => boolean
}
