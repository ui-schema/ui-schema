import React from "react"
import { NextPluginRendererProps } from '../../ui-schema/src/EditorPluginStack'
import { OrderedMap } from 'immutable'

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

export interface SchemaGridHandlerProps {
    children: nextPluginRendererHandler
}

export type nextPluginRendererHandler = (handler: NextPluginRendererProps) => NextPluginRendererProps

export function SchemaGridHandler<P extends SchemaGridHandlerProps | nextPluginRendererHandler>(props: P): React.Component<P>
