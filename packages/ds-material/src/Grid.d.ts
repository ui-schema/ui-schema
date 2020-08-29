import React from "react"
import { SchemaGridItemHelperProps, SchemaGridItemProps } from '@ui-schema/ui-schema/GridHelper'
import { WidgetProps } from "@ui-schema/ui-schema/Widget"

export function SchemGridItem<P extends SchemaGridItemProps>(props: P): React.Component<P>

export function RootRenderer<P>(props: P): React.Component<P>

export function GroupRenderer<P extends SchemaGridItemHelperProps>(props: P): React.Component<P>

export function SchemaGridHandler<P extends WidgetProps>(props: P): React.Component<P>
