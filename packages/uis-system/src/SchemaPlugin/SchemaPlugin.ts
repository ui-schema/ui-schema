import { WithValue } from '@ui-schema/react/UIStore'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { SchemaValidatorContext } from '@ui-schema/system/SchemaPluginStack'

export interface SchemaPlugin {
    handle: (props: WidgetProps & Omit<WithValue, 'onChange'> & SchemaValidatorContext) => Partial<WidgetProps & Omit<WithValue, 'onChange'> & SchemaValidatorContext>
    noHandle?: (props: WidgetProps & Omit<WithValue, 'onChange'> & SchemaValidatorContext) => Partial<WidgetProps & Omit<WithValue, 'onChange'> & SchemaValidatorContext>
    should?: (props: WidgetProps & Omit<WithValue, 'onChange'> & SchemaValidatorContext) => boolean
}
