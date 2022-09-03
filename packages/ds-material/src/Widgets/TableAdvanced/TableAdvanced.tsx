import React from 'react'
import { extractValue, WithValue } from '@ui-schema/react/UIStore'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { memo } from '@ui-schema/react/Utils/memo'
import { MuiWidgetsBinding } from '@ui-schema/ds-material/WidgetsBinding'

export const TableAdvancedBase: React.ComponentType<WidgetProps<MuiWidgetsBinding> & WithValue> = (
    {
        showValidity, schema, level, ...props
    }
) => {
    const {storeKeys} = props
    const readOnly = schema.get('readOnly') as boolean
    return <>
        <WidgetEngine<{ readOnly?: boolean }>
            showValidity={showValidity}
            storeKeys={storeKeys.push('data')}
            schema={schema.getIn(['properties', 'data']) as UISchemaMap}
            parentSchema={schema}
            level={level + 1}
            readOnly={readOnly}
            noGrid
        />
    </>
}

export const TableAdvanced: React.ComponentType<WidgetProps<MuiWidgetsBinding>> = extractValue(memo(TableAdvancedBase))
