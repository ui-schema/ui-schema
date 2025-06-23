import { useSchemaResource } from '@ui-schema/react/SchemaResourceProvider'
import { useMemoWithObject } from '@ui-schema/react/Utils/useMemoWithObject'
import { SchemaPlugin, SchemaPluginProps } from '@ui-schema/ui-schema/SchemaPlugin'
import { getNextPlugin, WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { SchemaPluginStack } from '@ui-schema/ui-schema/SchemaPluginStack'
import { ReactElement } from 'react'

export const schemaPluginsAdapterBuilder = <P extends WidgetPluginProps & SchemaPluginProps>(schemaPlugins: SchemaPlugin<NoInfer<Omit<P, 'currentPluginIndex'>>>[]) =>
    function SchemaPluginsAdapter({currentPluginIndex, ...props}: P): ReactElement {
        const next = currentPluginIndex + 1
        const Plugin = getNextPlugin(next, props.binding)
        const {resource} = useSchemaResource()

        const changedProps = useMemoWithObject(
            // todo: support overwrite via props?!
            () => schemaPlugins ? SchemaPluginStack<Omit<P, 'currentPluginIndex'>>({resource, ...props}, schemaPlugins) : props,
            {resource, ...props},
        )

        // todo: add memoization of e.g. merged schema here or add some kind of support of "changed" detection,
        //       and with it caching, in SchemaPluginStack itself, using an ref here to keep track of previous props?

        return <Plugin
            {...changedProps}
            currentPluginIndex={next}
        />
    }
