import React from 'react'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export function SchemaGridItem(props: React.PropsWithChildren<{ schema: UISchemaMap }>): React.ReactElement

export function getGridClasses(schema: UISchemaMap): string[]

export function RootRenderer<P>(props: P): React.ReactElement<P>

export function GroupRenderer<P>(props: P): React.ReactElement<P>

export function SchemaGridHandler<P extends WidgetProps>(props: P): React.ReactElement<P>
