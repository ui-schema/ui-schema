import type { UIMetaContextBase } from '@ui-schema/react/UIMeta'
import type { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import type { WidgetPayload } from '@ui-schema/ui-schema/Widget'
import { List } from 'immutable'
import { useEffect } from 'react'
import type { ComponentType, ReactNode } from 'react'
import { useImmutable } from '@ui-schema/react/Utils/useImmutable'
import { ErrorNoWidgetMatches, matchWidget } from '@ui-schema/ui-schema/matchWidget'
import type { WidgetEngineOverrideProps, WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import type { WithOnChange, WithValuePlain } from '@ui-schema/react/UIStore'
import type { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { BindingTypeWidgets, NoWidgetProps, WidgetProps } from '@ui-schema/react/Widget'

export interface WidgetRendererProps extends Omit<WidgetPluginProps, 'binding' | 'Next'> {
    WidgetOverride?: WidgetEngineOverrideProps['WidgetOverride']
}

/**
 * @todo remove once performance checks are finalized
 *       check tests and remove experimental in WidgetRenderer.test.tsx and UIEngineIntegration.test.tsx
 *       `remove experimental 0.5.x`
 */
const noExtractValueEnabled = false

export const WidgetRenderer = <A = UIStoreActions, B = {}, WP extends WidgetProps<B, A> = WidgetProps<B, A>>(
    {
        // we do not want `value`/`internalValue` to be passed to non-scalar widgets for performance reasons
        value, internalValue,
        WidgetOverride,
        errors,
        onErrors,
        // @ts-expect-error is currently omitted from props, as not needed, will still be passed down, lets prevent it from reaching Widget
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Next,
        // `props` contains all props accumulated in the WidgetEngine
        ...props
    }:
        WidgetRendererProps &
        Omit<NoInfer<WP>, 'binding' | keyof WidgetRendererProps> &
        {
            binding?:
                Omit<NoInfer<B>, 'VirtualRenderer' | 'NoWidget' | 'widgets' | 'matchWidget'> &
                {
                    VirtualRenderer?: ComponentType<WidgetPayload & UIMetaContextBase & WithOnChange & WithValuePlain>
                    NoWidget?: ComponentType<NoWidgetProps>
                } &
                Omit<BindingTypeWidgets<A, B, WP>, 'widgetPlugins' | 'WidgetRenderer'>
        },
): ReactNode => {
    const {schema, binding, isVirtual} = props
    const currentErrors = useImmutable(errors)

    useEffect(() => onErrors && onErrors(currentErrors), [onErrors, currentErrors])

    const schemaType = schema.get('type') as SchemaTypesType | undefined
    const widgetName = schema.get('widget') as string | undefined
    let Widget: ComponentType<WP> | null = null
    // todo: try further extracting isVirtual into a widgetPlugin, which uses WidgetOverride to switch to it?
    //       which also the virtualWidgets could use, to not further need `isVirtual`
    if (isVirtual) {
        Widget = binding?.VirtualRenderer as unknown as ComponentType<WP> || null
    } else if (WidgetOverride) {
        Widget = WidgetOverride
    } else {
        // todo: remove fallback once dev project is migrated? or allow optional?
        const matchWidgetFn = binding?.matchWidget || (matchWidget as NonNullable<NonNullable<typeof binding>['matchWidget']>)
        const widgets = binding?.widgets
        try {
            Widget = matchWidgetFn({
                widgetName: widgetName,
                schemaType: schemaType,
                widgets: widgets,
            })?.Widget || null
        } catch (e) {
            if (e instanceof ErrorNoWidgetMatches) {
                const NoWidget = binding?.NoWidget
                if (NoWidget) {
                    return <NoWidget
                        storeKeys={props.storeKeys}
                        scope={e.scope}
                        widgetId={e.widgetId}
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
