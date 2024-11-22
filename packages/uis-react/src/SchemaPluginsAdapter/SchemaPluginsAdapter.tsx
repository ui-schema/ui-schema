import React from 'react'
import { getNextPlugin, WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { SchemaPluginStack } from '@ui-schema/system/SchemaPluginStack'

export const SchemaPluginsAdapter = <P extends WidgetPluginProps>({currentPluginIndex, ...props}: P): React.ReactElement => {
    const next = currentPluginIndex + 1
    const Plugin = getNextPlugin(next, props.widgets)
    return <Plugin
        {...props.widgets.schemaPlugins ? SchemaPluginStack<Omit<WidgetPluginProps, 'currentPluginIndex'>>(props, props.widgets.schemaPlugins) : props}
        currentPluginIndex={next}
    />
}
