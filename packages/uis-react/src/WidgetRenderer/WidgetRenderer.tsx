import React from 'react'
import { useImmutable } from '@ui-schema/react/Utils/useImmutable'
import { ErrorNoWidgetMatching, widgetMatcher } from '@ui-schema/system/widgetMatcher'
import { List } from 'immutable'
import { WidgetEngineProps, WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { WithValue } from '@ui-schema/react/UIStore'
import { SchemaTypesType } from '@ui-schema/system/CommonTypings'
import { VirtualWidgetRenderer } from '@ui-schema/react/VirtualWidgetRenderer'
import { WidgetsBindingFactory, WidgetType } from '@ui-schema/react/Widgets'

export interface WidgetRendererProps<W extends WidgetsBindingFactory = WidgetsBindingFactory> extends Omit<WidgetPluginProps<W>, 'currentPluginIndex'>, WithValue {
    WidgetOverride?: WidgetEngineProps['WidgetOverride']
    // current number of plugin in the stack, received when executed as generic widget
    // but not when used on its own
    currentPluginIndex?: number
}

export const WidgetRenderer = <W extends WidgetsBindingFactory = WidgetsBindingFactory, P extends WidgetRendererProps = WidgetRendererProps>(
    {
        // we do not want `value`/`internalValue` to be passed to non-scalar widgets for performance reasons
        value, internalValue,
        WidgetOverride,
        errors,
        onErrors,
        // we do not want `requiredList` to be passed to the final widget for performance reasons
        // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
        requiredList,
        // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
        currentPluginIndex,
        // `props` contains all props accumulated in the WidgetEngine
        ...props
    }: P,
): React.ReactElement => {
    const {schema, widgets, isVirtual} = props
    const currentErrors = useImmutable(errors)

    React.useEffect(() => onErrors && onErrors(currentErrors), [onErrors, currentErrors])

    const schemaType = schema.get('type') as SchemaTypesType | undefined
    const widgetName = schema.get('widget') as string | undefined
    let Widget: WidgetType<{}, W> | null = null
    try {
        Widget =
            isVirtual ?
                VirtualWidgetRenderer as WidgetType<{}, W> :
                WidgetOverride ?
                    WidgetOverride as WidgetType<{}, W> :
                    widgetMatcher<W>({
                        widgetName: widgetName,
                        schemaType: schemaType,
                        widgets: widgets as W,
                    })
    } catch (e) {
        if (e instanceof ErrorNoWidgetMatching) {
            const {NoWidget} = widgets
            return <NoWidget
                matching={e.matching}
                scope={e.scope}
                storeKeys={props.storeKeys}
                schemaKeys={props.schemaKeys}
            />
        }
    }

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
        /* @ts-ignore */
        <Widget
            {...props}
            value={noExtractValue ? undefined : value}
            internalValue={noExtractValue ? undefined : internalValue}
            errors={currentErrors}
        /> : null as unknown as React.ReactElement
}
