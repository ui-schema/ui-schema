import { List } from 'immutable'
import React from 'react'
import { useImmutable } from '@ui-schema/react/Utils/useImmutable'
import { ErrorNoWidgetMatching, widgetMatcher } from '@ui-schema/system/widgetMatcher'
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

/**
 * @todo remove once performance checks are finalized
 *       check tests and remove experimental in WidgetRenderer.test.tsx and UIEngineIntegration.test.tsx
 *       `remove experimental 0.5.x`
 */
const noExtractValueEnabled = true

export const WidgetRenderer = <W extends WidgetsBindingFactory = WidgetsBindingFactory, P extends WidgetRendererProps = WidgetRendererProps, WT extends WidgetType<{}, W> = WidgetType<{}, W>>(
    {
        // we do not want `value`/`internalValue` to be passed to non-scalar widgets for performance reasons
        value, internalValue,
        WidgetOverride,
        errors,
        onErrors,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        currentPluginIndex,
        // `props` contains all props accumulated in the WidgetEngine
        ...props
    }: P,
): React.ReactNode => {
    const {schema, widgets, isVirtual} = props
    const currentErrors = useImmutable(errors)

    React.useEffect(() => onErrors && onErrors(currentErrors), [onErrors, currentErrors])

    const schemaType = schema.get('type') as SchemaTypesType | undefined
    const widgetName = schema.get('widget') as string | undefined
    let Widget: WT | null = null
    try {
        Widget =
            isVirtual ?
                // todo: only use widgets binding? move into future `widgetMatcher`?
                widgets.VirtualRenderer as unknown as WT || VirtualWidgetRenderer as WT :
                WidgetOverride ?
                    // todo: fix/change 0.5.0 WidgetOverride typing
                    WidgetOverride as unknown as WT :
                    // todo: as WidgetRenderer is now in widgetPlugins directly, move the matcher to the `widgets` binding,
                    //       to be able to use that directly where needed (e.g. FormGroup),
                    //       but in an adjusted version, which allows using "most WidgetProps" for the matcher logic
                    // @ts-ignore
                    widgetMatcher<WT, WT, W>({
                        widgetName: widgetName,
                        schemaType: schemaType,
                        widgets: widgets as W,
                    })
    } catch (e) {
        if (e instanceof ErrorNoWidgetMatching) {
            const {NoWidget} = widgets
            if (NoWidget) {
                return <NoWidget
                    matching={e.matching}
                    scope={e.scope}
                    storeKeys={props.storeKeys}
                />
            }
            return null
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
            value={noExtractValue && !noExtractValueEnabled ? undefined : value}
            internalValue={noExtractValue && !noExtractValueEnabled ? undefined : internalValue}
            errors={currentErrors}
        /> : null
}
