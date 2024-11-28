import { SchemaPlugin } from '@ui-schema/system/SchemaPlugin'
import React from 'react'
import { getNextPlugin, WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { SchemaPluginStack } from '@ui-schema/system/SchemaPluginStack'

export const SchemaPluginsAdapterBuilder = (schemaPlugins: SchemaPlugin[]) =>
    function SchemaPluginsAdapter<P extends WidgetPluginProps>({currentPluginIndex, ...props}: P): React.ReactElement {
        const next = currentPluginIndex + 1
        const Plugin = getNextPlugin(next, props.widgets)
        return <Plugin
            // todo: support overwrite via props?!
            {...schemaPlugins ? SchemaPluginStack<Omit<WidgetPluginProps, 'currentPluginIndex'>>(props, schemaPlugins) : props}
            currentPluginIndex={next}
        />
    }
