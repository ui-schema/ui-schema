import React from 'react'
import { extractValue, memo, PluginStack, StoreSchemaType, WidgetProps, WithValue } from '@ui-schema/ui-schema'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'

export const TableAdvancedBase: React.ComponentType<WidgetProps<MuiWidgetBinding> & WithValue> = (
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

export const TableAdvanced: React.ComponentType<WidgetProps<MuiWidgetBinding>> = extractValue(memo(TableAdvancedBase))
