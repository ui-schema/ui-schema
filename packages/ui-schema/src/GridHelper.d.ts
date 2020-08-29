import React from "react"
import { OrderedMap } from 'immutable'
import { WidgetProps } from "@ui-schema/ui-schema/Widget"

export interface SchemaGridItemHelperProps {
    children: React.ReactNode
}

export interface SchemaGridItemProps extends SchemaGridItemHelperProps {
    schema: OrderedMap<{}, undefined>
}

export function SchemGridItem<P extends SchemaGridItemProps>(props: P): React.Component<P>

export function RootRenderer<P>(props: P): React.Component<P>

export function GroupRenderer<P extends SchemaGridItemHelperProps>(props: P): React.Component<P>

export type noGridType = boolean | null

export interface SchemaGridHandlerProps2 {
    schema: OrderedMap<{}, undefined>
    noGrid?: noGridType
}

export function SchemaGridHandler<P extends WidgetProps>(props: P): React.ComponentType<P>
