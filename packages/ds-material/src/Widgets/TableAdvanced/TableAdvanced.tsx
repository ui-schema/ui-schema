import React from 'react'
import { extractValue, memo, PluginStack, StoreSchemaType, WidgetProps, WithValue } from '@ui-schema/ui-schema'

export const TableAdvancedBase: React.ComponentType<WidgetProps & WithValue> = (
    {
        showValidity, schema, level, ...props
    }
) => {
    const {storeKeys} = props
    const readOnly = schema.get('readOnly') as boolean
    return <>
        <PluginStack<{ readOnly?: boolean }>
            showValidity={showValidity}
            storeKeys={storeKeys.push('data')}
            schema={schema.getIn(['properties', 'data']) as StoreSchemaType}
            parentSchema={schema}
            level={level + 1}
            readOnly={readOnly}
            noGrid
        />
    </>
}

export const TableAdvanced: React.ComponentType<WidgetProps> = extractValue(memo(TableAdvancedBase))
