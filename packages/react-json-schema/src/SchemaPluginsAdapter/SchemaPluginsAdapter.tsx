import { useSchemaResource } from '@ui-schema/react/SchemaResourceProvider'
import { useMemoWithObject } from '@ui-schema/react/Utils/useMemoWithObject'
import { SchemaPlugin } from '@ui-schema/ui-schema/SchemaPlugin'
import { getNextPlugin, WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { SchemaPluginStack } from '@ui-schema/ui-schema/SchemaPluginStack'
import { ReactElement } from 'react'

export const SchemaPluginsAdapterBuilder = (schemaPlugins: SchemaPlugin[]) =>
    function SchemaPluginsAdapter<P extends WidgetPluginProps>({currentPluginIndex, ...props}: P): ReactElement {
        const next = currentPluginIndex + 1
        const Plugin = getNextPlugin(next, props.widgets)
        const {resource} = useSchemaResource()

        const changedProps = useMemoWithObject(
            // todo: support overwrite via props?!
            () => schemaPlugins ? SchemaPluginStack<Omit<WidgetPluginProps, 'currentPluginIndex'>>({resource, ...props}, schemaPlugins) : props,
            {resource, ...props},
        )

        return <Plugin
            {...changedProps}
            currentPluginIndex={next}
        />
    }
