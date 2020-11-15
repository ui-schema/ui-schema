import React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export function SchemaGridItem(props: React.PropsWithChildren<{
    schema: StoreSchemaType
    defaultMd?: number
    style?: React.CSSProperties
    className?: string
    // todo: add correct typing for mui `classes`
    classes?: any
}>): React.ReactElement

export function RootRenderer<P>(props: P): React.ReactElement<P>

export function GroupRenderer<P>(props: P): React.ReactElement

export function SchemaGridHandler<P extends WidgetProps>(props: P): React.ReactElement<P>
