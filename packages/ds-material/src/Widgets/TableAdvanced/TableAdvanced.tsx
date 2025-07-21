import { extractValue } from '@ui-schema/react/UIStore'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { WidgetProps } from '@ui-schema/react/Widget'
import type { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import { memo } from '@ui-schema/react/Utils/memo'

export const TableAdvancedBase = (
    {
        showValidity, schema, ...props
    }: WidgetProps,
) => {
    const {storeKeys} = props
    const readOnly = schema.get('readOnly') as boolean
    return <>
        <WidgetEngine<{ readOnly?: boolean } & WidgetProps>
            showValidity={showValidity}
            storeKeys={storeKeys.push('data')}
            schema={schema.getIn(['properties', 'data']) as SomeSchema}
            parentSchema={schema}
            readOnly={readOnly}
            noGrid
        />
    </>
}

export const TableAdvanced = extractValue(memo(TableAdvancedBase))
