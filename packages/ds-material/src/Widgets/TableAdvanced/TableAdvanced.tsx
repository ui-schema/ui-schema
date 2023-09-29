import React from 'react'
import { extractValue, WithValue } from '@ui-schema/react/UIStore'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { UISchemaMap } from '@ui-schema/system/Definitions'
import { memo } from '@ui-schema/react/Utils/memo'
import { MuiWidgetsBinding } from '@ui-schema/ds-material/WidgetsBinding'

export const TableAdvancedBase: React.ComponentType<WidgetProps<MuiWidgetsBinding> & WithValue> = (
    {
        showValidity, schema, ...props
    }
) => {
    const {storeKeys, schemaKeys} = props
    const readOnly = schema.get('readOnly') as boolean
    return <>
        <WidgetEngine<{ readOnly?: boolean } & WidgetProps>
            showValidity={showValidity}
            storeKeys={storeKeys.push('data')}
            schemaKeys={schemaKeys?.push('properties').push('data')}
            schema={schema.getIn(['properties', 'data']) as UISchemaMap}
            parentSchema={schema}
            readOnly={readOnly}
            noGrid
        />
    </>
}

export const TableAdvanced: React.ComponentType<WidgetProps<MuiWidgetsBinding>> = extractValue(memo(TableAdvancedBase))
