import React from 'react'
import { extractValue, WithValue } from '@ui-schema/react/UIStore'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { memo } from '@ui-schema/react/Utils/memo'
import { MuiWidgetsBinding } from '@ui-schema/ds-material/BindingType'

export const TableAdvancedBase: React.ComponentType<WidgetProps<MuiWidgetsBinding> & WithValue> = (
    {
        showValidity, schema, ...props
    }
) => {
    const {storeKeys} = props
    const readOnly = schema.get('readOnly') as boolean
    return <>
        <WidgetEngine<{ readOnly?: boolean } & WidgetProps>
            showValidity={showValidity}
            storeKeys={storeKeys.push('data')}
            schema={schema.getIn(['properties', 'data']) as UISchemaMap}
            parentSchema={schema}
            readOnly={readOnly}
            noGrid
        />
    </>
}

export const TableAdvanced: React.ComponentType<WidgetProps<MuiWidgetsBinding>> = extractValue(memo(TableAdvancedBase))
