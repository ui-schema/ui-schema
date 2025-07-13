import type { ComponentType, ReactNode } from 'react'
import { memo } from '@ui-schema/react/Utils/memo'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import type { GroupRendererProps, WidgetProps } from '@ui-schema/react/Widget'

export interface ObjectRendererProps extends WidgetProps {
    noGrid?: GroupRendererProps['noGrid']
    binding?: { GroupRenderer?: ComponentType<GroupRendererProps> }
}

export const ObjectRendererBase = (
    {
        schema, storeKeys,
        // for performance reasons, not pushing errors deeper
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        errors, value, internalValue, valid,
        ...props
    }: ObjectRendererProps,
): ReactNode => {
    const {isVirtual, binding} = props
    const properties = schema.get('properties')

    const GroupRenderer = binding?.GroupRenderer

    const propertyTree = properties?.map((childSchema, childKey) =>
        <WidgetEngine
            key={childKey}
            {...props}
            schema={childSchema} parentSchema={schema}
            storeKeys={storeKeys.push(childKey)}
        />,
    ).valueSeq() || null

    // no-properties could come from
    //   e.g. combining/conditional schemas which are currently not applied (e.g. a condition fails)
    return (
        isVirtual || !GroupRenderer ? propertyTree :
            properties ?
                <GroupRenderer
                    storeKeys={storeKeys}
                    noGrid={props.noGrid}
                    schema={schema}
                >
                    {propertyTree}
                </GroupRenderer> : null
    )
}

export const ObjectRenderer = memo(ObjectRendererBase)
