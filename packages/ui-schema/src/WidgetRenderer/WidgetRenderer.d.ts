import React from 'react'
import { PluginProps } from '@ui-schema/ui-schema/PluginStack/Plugin'
import { PluginStackProps } from '@ui-schema/ui-schema/PluginStack'

export interface WidgetRendererProps extends Pick<PluginProps,
    'level' | 'errors' | 'onChange' | 'ownKey' | 'parentSchema' | 'required' | 'requiredList' | 'schema' |
    'showValidity' | 'storeKeys' | 'value' | 'valid' | 'widgets'> {
    WidgetOverride?: PluginStackProps['WidgetOverride']
}

export function WidgetRenderer<P extends WidgetRendererProps>(props: P): React.ReactElement<P>
