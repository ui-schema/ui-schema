import { PluginStackProps, StoreSchemaType } from '@ui-schema/ui-schema'
import React from 'react'

export interface ObjectGroupProps {
    onSchema?: (schema: StoreSchemaType) => void
}

export const ObjectGroup: React.ComponentType<ObjectGroupProps & Omit<PluginStackProps, ['WidgetOverride']>>

