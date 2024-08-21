import { WithValue } from '@ui-schema/react/UIStore'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { SchemaValidatorContext } from '@ui-schema/system/SchemaPluginStack'

export type SchemaPluginProps = WidgetProps & Omit<WithValue, 'onChange'> & SchemaValidatorContext

export interface SchemaPlugin {
    handle: (props: SchemaPluginProps) => Partial<SchemaPluginProps>
    noHandle?: (props: SchemaPluginProps) => Partial<SchemaPluginProps>
    should?: (props: SchemaPluginProps) => boolean
}
