import React from 'react'
import { memo } from '@ui-schema/react/Utils/memo'
import { CustomLeafsRenderMapping, WidgetEngine } from '@ui-schema/react/UIEngine'
import { GroupRendererProps, WidgetProps } from '@ui-schema/react/Widgets'

export interface ObjectRendererProps extends WidgetProps {
    noGrid?: GroupRendererProps['noGrid']
}

const ObjectRendererBase = <P extends ObjectRendererProps & { render: CustomLeafsRenderMapping<{}, { GroupRenderer?: React.ComponentType<React.PropsWithChildren<GroupRendererProps>> }> }>(
    {
        schema, storeKeys, schemaKeys,
        // for performance reasons, not pushing errors deeper
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        errors,
        ...props
    }: P,
): React.ReactNode => {
    const {isVirtual, render} = props
    const properties = schema.get('properties')

    if (!isVirtual && !render.components.GroupRenderer) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Widget GroupRenderer not existing')
        }
        return null
    }
    const GroupRenderer = render.components.GroupRenderer

    const propertyTree = properties?.map((childSchema, childKey) =>
        <WidgetEngine
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
