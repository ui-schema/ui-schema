import React from "react"
import { SchemaGridItemHelperProps, SchemaGridItemProps, SchemaGridHandlerProps, nextPluginRendererHandler } from '@ui-schema/ui-schema/GridHelper'

export function SchemGridItem<P extends SchemaGridItemProps>(props: P): React.Component<P>

export function RootRenderer<P>(props: P): React.Component<P>

export function GroupRenderer<P extends SchemaGridItemHelperProps>(props: P): React.Component<P>

export function SchemaGridHandler<P extends SchemaGridHandlerProps | nextPluginRendererHandler>(props: P): React.Component<P>
