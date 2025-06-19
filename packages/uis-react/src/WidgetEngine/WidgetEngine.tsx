import { StoreKeyType } from '@ui-schema/system/ValueStore'
import { ComponentType, ReactElement, ReactNode } from 'react'
import { List } from 'immutable'
import { memo } from '@ui-schema/react/Utils/memo'
import { UIMetaContext, useUIMeta } from '@ui-schema/react/UIMeta'
import { onErrorHandler } from '@ui-schema/system/ValidatorOutput'
import { StoreKeys, useUIConfig, useUIStore } from '@ui-schema/react/UIStore'
import { useImmutable } from '@ui-schema/react/Utils/useImmutable'
import { WidgetEngineErrorBoundary, WidgetPluginProps, WidgetPluginType } from '@ui-schema/react/WidgetEngine'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { AppliedWidgetEngineProps, WidgetEngineRootOrNestedProps, WidgetEngineRootProps } from '@ui-schema/react/applyWidgetEngine'
import { WidgetOverrideType, WidgetProps, WidgetsBindingFactory } from '@ui-schema/react/Widgets'
import { useUIStoreActions } from '@ui-schema/react/UIStoreActions'

export type WidgetEngineWrapperProps = {
    children: ReactNode
    schema: UISchemaMap
    storeKeys: StoreKeys
}

export type WidgetEngineInjectProps = 'currentPluginIndex' | 'errors' | 'valid' | 'storeKeys'/* | 'parentSchema'*/// |
// todo find a better way to define from-plugin injected values as "required" - or shouldn't?
// 'value' | 'onChange' | 'internalValue'

export type WidgetEngineProps<
    W extends WidgetsBindingFactory = WidgetsBindingFactory,
    PWidget extends WidgetProps<W> = WidgetProps<W>,
    CMeta = {},
    PWrapper extends {} = {}
> =
    AppliedWidgetEngineProps<CMeta, W, PWidget>
    & {

    // listen from a hoisted component for `errors` changing,
    // useful for some performance optimizes like at ds-material Accordions
    onErrors?: onErrorHandler

    // override widgets of MetaProvider for this particular WidgetEngine (passed down at some use cases)
    // widgets?: WidgetsBindingBase

    // override any widget for just this WidgetEngine, not passed down further on
    // better use `applyWidgetEngine` instead! https://ui-schema.bemit.codes/docs/core-pluginstack#applypluginstack
    // todo: actually `WidgetOverride` is a WidgetRenderer prop - and also passed through the plugins, so should be in PluginProps also - but not in WidgetProps
    WidgetOverride?: WidgetOverrideType<CMeta, PWidget, W>

    // wraps the whole stack internally, as interfacing for the utility function `injectWidgetEngine`
    // only rendered when not "virtual"
    StackWrapper?: ComponentType<WidgetEngineWrapperProps & PWrapper>

    wrapperProps?: PWrapper
}

function isRootProps(props: WidgetEngineRootOrNestedProps): props is WidgetEngineRootProps {
    return props.isRoot === true
}

export const WidgetEngine = <
    PWidget extends WidgetProps<WidgetsBindingFactory> = WidgetProps<WidgetsBindingFactory>,
    PWrapper extends {} = {},
    // TMeta extends UIMetaContext = UIMetaContext,
>(props: WidgetEngineProps<WidgetsBindingFactory, PWidget, UIMetaContext, PWrapper>): ReactNode => {
    type U = {}
    // todo: move UIMetaContext in generics, if possible, when moved there the `Omit` from applied removes too many somehow
    const {widgets, ...meta} = useUIMeta<UIMetaContext, WidgetsBindingFactory>()
    const config = useUIConfig<U>()
    const {store, showValidity} = useUIStore()
    const {onChange} = useUIStoreActions()
    const {
        schema,
        parentSchema,
        widgets: customWidgets,
        StackWrapper, wrapperProps,
        // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
        isRoot,
        ...nestedProps
    } = props

    let storeKeys: StoreKeys
    if (isRootProps(props)) {
        storeKeys = List<StoreKeyType>([])
    } else {
        // todo: remove fallbacks and add hard errors?
        storeKeys = props.storeKeys || List<StoreKeyType>([])
    }

    const values = store?.extractValues(storeKeys)
    // central reference integrity of `storeKeys` for all plugins and the receiving widget, otherwise `useImmutable` is needed more times, e.g. 3 times in plugins + 1x time in widget
    const currentStoreKeys = useImmutable(storeKeys)
    const activeWidgets: WidgetsBindingFactory = customWidgets || widgets

    // todo: resolving `hidden` here is wrong, must be done after merging schema / resolving referenced
    const isVirtual = Boolean(props.isVirtual || schema?.get('hidden'))

    const stack =
        <NextPluginRendererMemo<{}, U, WidgetsBindingFactory>
            {...meta}
            {...config}
            {...nestedProps}
            currentPluginIndex={-1}
            widgets={activeWidgets}
            storeKeys={currentStoreKeys}
            parentSchema={parentSchema}
            schema={schema as UISchemaMap}
            // `showValidity` is overridable by render flow, e.g. nested Stepper
            showValidity={props.showValidity || showValidity}
            onChange={onChange}
            {...values || {}} // pass down all extracted, to support extending `extractValues`
            value={values?.value}
            internalValue={values?.internalValue}
            isVirtual={isVirtual}
            valid
        />

    const wrappedStack = StackWrapper && !isVirtual ?
        <StackWrapper
            schema={schema}
            storeKeys={currentStoreKeys}
            {...(wrapperProps || {}) as PWrapper}
        >{stack}</StackWrapper> :
        stack

    return schema ?
        activeWidgets?.ErrorFallback ?
            <WidgetEngineErrorBoundary
                FallbackComponent={activeWidgets.ErrorFallback}
                type={schema.get('type')}
                widget={schema.get('widget')}
                storeKeys={currentStoreKeys}
            >
                {wrappedStack}
            </WidgetEngineErrorBoundary> :
            wrappedStack :
        null
}

export const getNextPlugin =
    <C = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory>(
        next: number,
        {widgetPlugins: wps}: W,
    ): WidgetPluginType<C, W> => {
        if (wps && next in wps) {
            return wps[next] as WidgetPluginType<C, W>
        }

        throw new Error(`WidgetPlugin overflow, no plugin at ${next}.`)
    }

export const NextPluginRenderer = <C = {}, U extends object = object, W extends WidgetsBindingFactory = WidgetsBindingFactory, P extends WidgetPluginProps<W> = WidgetPluginProps<W>>(
    {
        currentPluginIndex,
        ...props
    }: P & C & U,
): ReactElement => {
    const next = currentPluginIndex + 1
    const Plugin = getNextPlugin<C, W>(next, props.widgets)
    return <Plugin {...{currentPluginIndex: next, ...props} as P & C & U}/>
}

export const NextPluginRendererMemo = memo(NextPluginRenderer) as <C = {}, U extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory, P extends WidgetPluginProps<W> = WidgetPluginProps<W>>(props: P & C & U) => ReactElement
