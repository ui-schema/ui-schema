/* eslint-disable @typescript-eslint/no-deprecated */
import { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import React from 'react'
import { AppliedWidgetEngineProps, applyWidgetEngine } from '@ui-schema/react/applyWidgetEngine'
import { useImmutable } from '@ui-schema/react/Utils/useImmutable'
import { WidgetProps } from '@ui-schema/react/Widget'

export interface SchemaLayerProps {
    onSchema?: (schema: SomeSchema) => void
}

const SchemaLayerGroupBase: React.ComponentType<React.PropsWithChildren<AppliedWidgetEngineProps<{}, SchemaLayerProps & WidgetProps>>> = ({schema, children, onSchema}) => {
    const currentSchema = useImmutable(schema)

    React.useEffect(() => {
        if (onSchema) {
            onSchema(currentSchema)
        }
    }, [onSchema, currentSchema])

    return children as unknown as React.ReactElement
}

export const SchemaLayer = applyWidgetEngine(SchemaLayerGroupBase)
