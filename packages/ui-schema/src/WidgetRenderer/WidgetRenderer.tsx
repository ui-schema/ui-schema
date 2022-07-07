import React from 'react'
import { useImmutable } from '@ui-schema/ui-schema/Utils'
import { widgetMatcher, NoWidgetProps } from '@ui-schema/ui-schema/widgetMatcher'
import { List } from 'immutable'
import { PluginProps } from '@ui-schema/ui-schema/PluginStack/Plugin'
import { PluginStackProps } from '@ui-schema/ui-schema/PluginStack'
import { WithValue } from '@ui-schema/ui-schema/UIStore'
import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'

export interface WidgetRendererProps extends Omit<PluginProps, 'currentPluginIndex'>, WithValue {
    WidgetOverride?: PluginStackProps['WidgetOverride']
    NoWidget?: React.ComponentType<NoWidgetProps>
    // current number of plugin in the stack, received when executed as generic widget
    // but not when used on its own
    currentPluginIndex?: number
}

export const WidgetRenderer: React.ComponentType<WidgetRendererProps> = (
    {
        // we do not want `value`/`internalValue` to be passed to non-scalar widgets for performance reasons
        value, internalValue,
        WidgetOverride,
        NoWidget,
        errors,
        onErrors,
        // we do not want `requiredList` to be passed to the final widget for performance reasons
        // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
        requiredList,
        // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
        currentPluginIndex,
        // `props` contains all props accumulated in the PluginStack
        ...props
    },
) => {
    const {schema, widgets, isVirtual} = props
    const currentErrors = useImmutable(errors)

    React.useEffect(() => onErrors && onErrors(currentErrors), [onErrors, currentErrors])

    const schemaType = schema.get('type') as SchemaTypesType | undefined
    const widgetName = schema.get('widget') as string | undefined
    const Widget = widgetMatcher({
        isVirtual: Boolean(isVirtual),
        WidgetOverride: WidgetOverride,
        NoWidget: NoWidget,
        widgetName: widgetName,
        schemaType: schemaType,
        widgets: widgets,
    })

    const noExtractValue = !isVirtual && (
        schemaType === 'array' || schemaType === 'object' ||
        (
            List.isList(schemaType) && (
                schemaType.indexOf('array') !== -1 ||
                schemaType.indexOf('object') !== -1
            )
        )
    )
    return Widget ?
        <Widget
            {...props}
            value={noExtractValue ? undefined : value}
            internalValue={noExtractValue ? undefined : internalValue}
            errors={currentErrors}
        /> : null
}
