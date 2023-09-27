import React from 'react'
import { memo } from '@ui-schema/react/Utils/memo'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { LeafsRenderMapping } from '@tactic-ui/react/LeafsEngine'
import { GroupRendererProps, WidgetProps } from '@ui-schema/react/Widgets'

export interface ObjectRendererProps extends WidgetProps {
    noGrid?: GroupRendererProps['noGrid']
}

const WidgetEngineMemo = memo(WidgetEngine)

const ObjectRendererBase = <P extends ObjectRendererProps & { renderMap: LeafsRenderMapping<{}, { GroupRenderer?: React.ComponentType<React.PropsWithChildren<GroupRendererProps>> }> }>(
    {
        schema, storeKeys, schemaKeys,
        // for performance reasons, not pushing errors deeper
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        errors,
        ...props
    }: P,
): React.ReactNode => {
    const {isVirtual, renderMap} = props
    const properties = schema.get('properties')

    if (!isVirtual && !renderMap.components.GroupRenderer) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Widget GroupRenderer not existing')
        }
        return null
    }
    const GroupRenderer = renderMap.components.GroupRenderer

    const propertyTree = properties?.map((childSchema, childKey) =>
        <WidgetEngineMemo
            key={childKey}
            {...props}
            schema={childSchema} parentSchema={schema}
            storeKeys={storeKeys.push(childKey)}
            schemaKeys={schemaKeys?.push('properties').push(childKey)}
        />,
    ).valueSeq() || null

    // no-properties could come from
    //   e.g. combining/conditional schemas which are currently not applied (e.g. a condition fails)
    return (
        isVirtual || !GroupRenderer ? propertyTree :
            properties ?
                <GroupRenderer
                    storeKeys={storeKeys} schemaKeys={schemaKeys}
                    noGrid={props.noGrid}
                    schema={schema}
                >
                    {propertyTree}
                </GroupRenderer> : null
    ) as unknown as React.ReactElement
}
export const ObjectRenderer = memo(ObjectRendererBase)
