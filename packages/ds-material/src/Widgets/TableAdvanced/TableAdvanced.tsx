import React from 'react'
import { extractValue, memo, PluginStack, WidgetProps, WithValue } from '@ui-schema/ui-schema'

export const TableAdvancedBase: React.ComponentType<WidgetProps & WithValue> = (
    {
        showValidity, schema, level, ...props
    }
) => {
    const {storeKeys} = props
    const readOnly = schema.get('readOnly') as boolean
    return <>
        <h2>Advanced</h2>
        <PluginStack<{ readOnly?: boolean }>
            showValidity={showValidity}
            storeKeys={storeKeys.push('data')}
            schema={schema.getIn(['properties', 'data'])}
            parentSchema={schema}
            level={level + 1}
            readOnly={readOnly}
            noGrid
        />
    </>
}

export const TableAdvanced: React.ComponentType<WidgetProps> = extractValue(memo(TableAdvancedBase))
