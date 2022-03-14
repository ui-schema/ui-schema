import React from 'react'
import { extractValue, WidgetProps, WithValue } from '@ui-schema/ui-schema'

const EditableContentBase: React.ComponentType<WidgetProps & WithValue> = () => {
    return <div>Dummy</div>
}

export const EditableContent = extractValue(EditableContentBase) as React.ComponentType<WidgetProps>
