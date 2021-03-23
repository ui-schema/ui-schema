import React from 'react'
import { extractValue, memo, PluginStack, WidgetProps, WithValue } from '@ui-schema/ui-schema'

let TableAdvanced: React.ComponentType<WidgetProps & WithValue> = (
    {
        showValidity, schema, level, ...props
    }
) => {
    const {storeKeys} = props
    const readOnly = schema.get('readOnly')
    return <>
        <h2>Advanced</h2>
        <PluginStack
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

TableAdvanced = extractValue(memo(TableAdvanced))

export { TableAdvanced }
