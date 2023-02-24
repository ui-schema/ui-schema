import React from 'react'
import { memo } from '@ui-schema/react/Utils/memo'
import { WidgetEngine } from '@ui-schema/react/UIEngine'
import { GroupRendererProps, WidgetProps } from '@ui-schema/react/Widgets'

export interface ObjectRendererProps extends WidgetProps {
    noGrid?: GroupRendererProps['noGrid']
}

const ObjectRendererBase: React.FC<ObjectRendererProps> = (
    {
        schema, storeKeys, schemaKeys,
        // for performance reasons, not pushing errors deeper
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        errors,
        ...props
    },
) => {
    const {isVirtual, widgets} = props
    const properties = schema.get('properties')

    if (!isVirtual && !widgets.GroupRenderer) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Widget GroupRenderer not existing')
        }
        return null
    }
    const GroupRenderer = widgets.GroupRenderer

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
        isVirtual ? propertyTree :
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
