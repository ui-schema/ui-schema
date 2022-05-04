import * as React from 'react'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

// - `C` = custom `SchemaRootProvider` context additions
export interface UIRootRendererProps<C extends {} = { [k: string]: any }> {

    // the schema, used by the render logic, plugins and widgets to create a UI
    schema: StoreSchemaType

    // custom props, enforcing that this schema is treated as "schema-root-level"
    // available then in `SchemaRootProvider`, used by e.g. `ReferencingHandler` to initiate the root provider
    // ! be sure to memo the content, e.g. the UIRootRenderer should not re-render on every store changes
    rootContext?: C
}

/**
 * @deprecated use e.g. `GridContainer` with `PluginStack` directly
 */
export function UIRootRenderer<C extends {} = {}>(props: UIRootRendererProps<C>): React.ReactElement
