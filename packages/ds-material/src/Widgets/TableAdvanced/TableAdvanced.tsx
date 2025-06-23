import React from 'react'
import { extractValue, WithValue } from '@ui-schema/react/UIStore'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { memo } from '@ui-schema/react/Utils/memo'

export const TableAdvancedBase = (
    {
        showValidity, schema, ...props
    }: WidgetProps & WithValue,
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

export const TableAdvanced = extractValue(memo(TableAdvancedBase))
