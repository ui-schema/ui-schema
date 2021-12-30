import React from 'react'
import { AppliedPluginStackProps, StoreSchemaType, WidgetProps } from '@ui-schema/ui-schema'

export interface ObjectGroupProps {
    onSchema?: (schema: StoreSchemaType) => void
}

export const ObjectGroup: React.ComponentType<AppliedPluginStackProps<{}, ObjectGroupProps & WidgetProps>>

