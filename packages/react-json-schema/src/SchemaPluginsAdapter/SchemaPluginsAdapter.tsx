import { useSchemaResource } from '@ui-schema/react/SchemaResourceProvider'
import { useMemoWithObject } from '@ui-schema/react/Utils/useMemoWithObject'
import type { SchemaPlugin, SchemaPluginProps } from '@ui-schema/ui-schema/SchemaPlugin'
import type { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { SchemaPluginStack } from '@ui-schema/ui-schema/SchemaPluginStack'
import type { ReactElement } from 'react'

export const schemaPluginsAdapterBuilder = <P extends WidgetPluginProps & SchemaPluginProps>(schemaPlugins: SchemaPlugin<NoInfer<Omit<P, 'currentPluginIndex' | 'Next'>>>[]) =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function SchemaPluginsAdapter({Next, currentPluginIndex, ...props}: P): ReactElement {
        const {resource} = useSchemaResource()

        const changedProps = useMemoWithObject(
            // todo: support overwrite via props?!
            () => schemaPlugins?.length ? SchemaPluginStack<Omit<P, 'currentPluginIndex' | 'Next'>>({resource, ...props}, schemaPlugins) : props,
            {resource, ...props},
        )

        // todo: add memoization of e.g. merged schema here or add some kind of support of "changed" detection,
        //       and with it caching, in SchemaPluginStack itself, using an ref here to keep track of previous props?

        return <Next.Component
            {...changedProps}
        />
    }
