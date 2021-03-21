import React from 'react'
import { extractValue, WidgetProps, WithValue } from '@ui-schema/ui-schema'

let EditableContent: React.ComponentType<WidgetProps & WithValue> = () => {
    return <div>Dummy</div>
}

EditableContent = extractValue(EditableContent)

export { EditableContent }
