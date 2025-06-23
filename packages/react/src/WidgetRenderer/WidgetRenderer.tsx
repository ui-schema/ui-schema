import { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import { VirtualWidgetRenderer } from '@ui-schema/react/VirtualWidgetRenderer'
import { List } from 'immutable'
import React, { ComponentType, ReactNode } from 'react'
import { useImmutable } from '@ui-schema/react/Utils/useImmutable'
import { ErrorNoWidgetMatching, widgetMatcher } from '@ui-schema/ui-schema/widgetMatcher'
import { WidgetEngineOverrideProps, WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { WithValue } from '@ui-schema/react/UIStore'
import { SchemaKeywordType, SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { MatchProps, NoWidgetProps, WidgetPropsComplete } from '@ui-schema/react/Widgets'

export interface WidgetRendererProps extends Omit<WidgetPluginProps, 'binding' | 'currentPluginIndex'>, WithValue {
    WidgetOverride?: WidgetEngineOverrideProps['WidgetOverride']
    // current number of plugin in the stack, received when executed as generic widget
    // but not when used on its own
    // todo; cleanup, with 0.5.x there is no reason to use it on its own
    currentPluginIndex?: number
}

/**
 * @todo remove once performance checks are finalized
 *       check tests and remove experimental in WidgetRenderer.test.tsx and UIEngineIntegration.test.tsx
 *       `remove experimental 0.5.x`
 */
const noExtractValueEnabled = false

export const WidgetRenderer = <A = UIStoreActions, WP extends WidgetPropsComplete<A> = WidgetPropsComplete<A>>(
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
    }:
        WidgetRendererProps &
        Omit<NoInfer<WP>, 'binding' | keyof WidgetRendererProps> &
        {
            binding?: {
                NoWidget?: React.ComponentType<NoWidgetProps>
                widgets?: {
                    types?: { [K in SchemaKeywordType]?: (props: WP) => ReactNode }
                    custom?: Record<string, (props: WP) => ReactNode>
                }
                matchWidget?: (props: MatchProps<A, WP>) => null | (<PWidget>(props: Omit<NoInfer<PWidget>, keyof WP> & WP) => ReactNode)
            }
        },
    // {
    //     binding?: {
    //         NoWidget?: React.ComponentType<NoWidgetProps>
    //     }
    // } &
    // {
    //     binding?: {
    //         widgets?: {
    //             types?: { [K in SchemaKeywordType]?: (props: WP) => ReactNode }
    //             custom?: Record<string, (props: WP) => ReactNode>
    //         }
    //     }
    // } &
    // {
    //     binding?: {
    //         matchWidget?: (props: MatchProps<A, WP>) => null | (<PWidget>(props: Omit<NoInfer<PWidget>, keyof WP> & WP) => ReactNode)
    //     }
    // },
): React.ReactNode => {
    const {schema, binding, isVirtual} = props
    const currentErrors = useImmutable(errors)

    React.useEffect(() => onErrors && onErrors(currentErrors), [onErrors, currentErrors])

    const schemaType = schema.get('type') as SchemaTypesType | undefined
    const widgetName = schema.get('widget') as string | undefined
    let Widget: ComponentType<WP> | null = WidgetOverride || null
    if (!Widget) {
        // todo: remove fallback once dev project is migrated? or allow optional?
        // todo: check typings and fix it, `binding` is already `any`
        const matchWidget = binding?.matchWidget || widgetMatcher
        const widgets = binding?.widgets
        try {
            Widget =
                // todo: optimize/migrate isVirtual
                isVirtual ? binding?.VirtualRenderer || VirtualWidgetRenderer :
                    matchWidget({
                        widgetName: widgetName,
                        schemaType: schemaType,
                        widgets: widgets,
                    })
        } catch (e) {
            if (e instanceof ErrorNoWidgetMatching) {
                const NoWidget = binding?.NoWidget
                if (NoWidget) {
                    return <NoWidget
                        matching={e.matching}
                        scope={e.scope}
                        storeKeys={props.storeKeys}
                    />
                }
                return null
            }
            throw e
        }
    }

    const noExtractValue = noExtractValueEnabled && !isVirtual && (
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
            {...props as unknown as WP}
            value={noExtractValue ? undefined : value}
            internalValue={noExtractValue ? undefined : internalValue}
            errors={currentErrors}
        /> : null
}
