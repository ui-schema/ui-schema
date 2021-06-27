import * as React from 'react'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export interface UIRootRendererProps {
    schema: StoreSchemaType
}

export function UIRootRenderer(props: UIRootRendererProps): React.ReactElement
