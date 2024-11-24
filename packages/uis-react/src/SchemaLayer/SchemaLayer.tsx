import React from 'react'
import { AppliedWidgetEngineProps, applyWidgetEngine } from '@ui-schema/react/applyWidgetEngine'
import { useImmutable } from '@ui-schema/react/Utils/useImmutable'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { WidgetProps, WidgetsBindingFactory } from '@ui-schema/react/Widgets'

export interface SchemaLayerProps {
    onSchema?: (schema: UISchemaMap) => void
}

const SchemaLayerGroupBase: React.ComponentType<React.PropsWithChildren<AppliedWidgetEngineProps<{}, WidgetsBindingFactory, SchemaLayerProps & WidgetProps<WidgetsBindingFactory>>>> = ({schema, children, onSchema}) => {
    const currentSchema = useImmutable(schema)

    React.useEffect(() => {
        if (onSchema) {
            onSchema(currentSchema)
        }
    }, [onSchema, currentSchema])

    return children as unknown as React.ReactElement
}
// @ts-expect-error incompatible with widgets factory
export const SchemaLayer = applyWidgetEngine(SchemaLayerGroupBase)
