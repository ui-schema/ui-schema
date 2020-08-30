import React from "react"
import { WidgetProps } from "@ui-schema/ui-schema/Widget"
import { schema } from "@ui-schema/ui-schema/CommonTypings"

export function SchemaGridItem(props: React.PropsWithChildren<{ schema: schema }>): React.Component

export function RootRenderer<P>(props: P): React.Component<P>

export function GroupRenderer<P>(props: P): React.Component

export function SchemaGridHandler<P extends WidgetProps>(props: P): React.Component<P>
