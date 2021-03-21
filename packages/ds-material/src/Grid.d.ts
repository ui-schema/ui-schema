import React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { GroupRendererProps } from '@ui-schema/ui-schema'

export function SchemaGridItem(props: React.PropsWithChildren<{
    schema: StoreSchemaType
    defaultMd?: number
    style?: React.CSSProperties
    className?: string
    // todo: add correct typing for mui `classes`
    classes?: any
}>): React.ReactElement

export function RootRenderer(props: React.PropsWithChildren<{}>): React.ReactElement

export function GroupRenderer(props: GroupRendererProps): React.ReactElement

export function SchemaGridHandler(props: WidgetProps): React.ReactElement
