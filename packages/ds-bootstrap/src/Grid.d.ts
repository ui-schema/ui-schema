import React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export function SchemaGridItem(props: React.PropsWithChildren<{ schema: StoreSchemaType }>): React.ReactElement

export function getGridClasses(schema: StoreSchemaType): string[]

export function RootRenderer<P>(props: P): React.ReactElement<P>

export function GroupRenderer<P>(props: P): React.ReactElement<P>

export function SchemaGridHandler<P extends WidgetProps>(props: P): React.ReactElement<P>
