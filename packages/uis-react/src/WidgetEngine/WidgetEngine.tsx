import { StoreKeyType } from '@ui-schema/system/ValueStore'
import React from 'react'
import { List } from 'immutable'
import { memo } from '@ui-schema/react/Utils/memo'
import { useUIMeta } from '@ui-schema/react/UIMeta'
import { createValidatorErrors } from '@ui-schema/system/ValidatorErrors'
import { StoreKeys, UIStoreType, useUIConfig, useUIStore, WithValue } from '@ui-schema/react/UIStore'
import { useImmutable } from '@ui-schema/react/Utils/useImmutable'
import { WidgetEngineErrorBoundary, WidgetPluginProps, WidgetPluginType } from '@ui-schema/react/WidgetEngine'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { AppliedWidgetEngineProps } from '@ui-schema/react/applyWidgetEngine'
import { WidgetOverrideType, WidgetProps, WidgetsBindingFactory } from '@ui-schema/react/Widgets'
import { useUIStoreActions } from '@ui-schema/react/UIStoreActions'

export type WidgetEngineWrapperProps = {
    children: React.ReactNode
    schema: UISchemaMap
    storeKeys: StoreKeys
    schemaKeys: StoreKeys
}

export type WidgetEngineInjectProps = 'currentPluginIndex' | 'requiredList' | 'required' | 'errors' | 'valid' | 'storeKeys'/* | 'parentSchema'*/// |
// todo find a better way to define from-plugin injected values as "required" - or shouldn't?
// 'value' | 'onChange' | 'internalValue'

export type WidgetEngineProps<W extends WidgetsBindingFactory = WidgetsBindingFactory, PWidget extends WidgetProps<W> = WidgetProps<W>, C extends {} = {}, PWrapper extends {} = {}> =
    AppliedWidgetEngineProps<C, W, PWidget>
    & {

    // listen from a hoisted component for `errors` changing,
    // useful for some performance optimizes like at ds-material Accordions
    // onErrors?: onErrors

    // override widgets of MetaProvider for this particular WidgetEngine (passed down at some use cases)
    // widgets?: WidgetsBindingBase

    // override any widget for just this WidgetEngine, not passed down further on
    // better use `applyWidgetEngine` instead! https://ui-schema.bemit.codes/docs/core-pluginstack#applypluginstack
    // todo: actually `WidgetOverride` is a WidgetRenderer prop - and also passed through the plugins, so should be in PluginProps also - but not in WidgetProps
    WidgetOverride?: WidgetOverrideType<C, PWidget, W>

    // wraps the whole stack internally, as interfacing for the utility function `injectWidgetEngine`
    // only rendered when not "virtual"
    StackWrapper?: React.ComponentType<WidgetEngineWrapperProps & PWrapper>

    wrapperProps?: PWrapper
    // overwrite the value extraction, can return more values than required
    extractValues?: (store: UIStoreType<any> | undefined) =>
        WithValue &
        { [k: string]: any } &
        { [N in keyof PWidget]: never }


    // all other props are passed down to all rendering Plugins and the final widget
    // except defined `props` removed by `WidgetRenderer`: https://ui-schema.bemit.codes/docs/core-renderer#widgetrenderer
    // [key: string]: any
}

// `extractValue` has moved to own plugin `ExtractStorePlugin` since `0.3.0`
// `withUIMeta` and `memo` are not needed for performance optimizing since `0.3.0` at this position
export const WidgetEngine = <PWidget extends WidgetProps = WidgetProps, C extends {} = {}, P extends WidgetEngineProps<WidgetsBindingFactory, PWidget, C> = WidgetEngineProps<WidgetsBindingFactory, PWidget, C>, U extends {} = {}>(
    {StackWrapper, wrapperProps, extractValues, ...props}: P,
): React.ReactElement => {
    const {widgets, ...meta} = useUIMeta<C, WidgetsBindingFactory>()
    const config = useUIConfig<U>()
    const {store, showValidity} = useUIStore()
    const {onChange} = useUIStoreActions()
    const {
        parentSchema,
        storeKeys = List<StoreKeyType>([]),
        schemaKeys = List<StoreKeyType>([]),
        schema,
        widgets: customWidgets,
        // todo: fix typing of `WidgetEngineProps`
    } = props as unknown as WidgetProps<WidgetsBindingFactory>
    const values = extractValues ? extractValues(store) : store?.extractValues(storeKeys)
    // central reference integrity of `storeKeys` for all plugins and the receiving widget, otherwise `useImmutable` is needed more times, e.g. 3 times in plugins + 1x time in widget
    const currentStoreKeys = useImmutable(storeKeys)
    const errorContainer = React.useMemo(() => createValidatorErrors(), [])
    const currentSchemaKeys = useImmutable(schemaKeys)
    const activeWidgets = customWidgets || widgets

    // todo: resolving `hidden` here is wrong, must be done after merging schema / resolving referenced
    // @ts-ignore
    const isVirtual = Boolean(props.isVirtual || schema?.get('hidden'))
    let required: List<string> = List<string>([])
    if (parentSchema) {
        // todo: resolving `required` here is wrong, must be done after merging schema / resolving referenced
        //      ! actual, it is correct here, as using `parentSchema`
        const tmp_required = parentSchema.get('required')
        if (tmp_required) {
            required = tmp_required
        }
    }

    const stack =
        // @ts-ignore
        <NextPluginRendererMemo<C, U, WidgetsBindingFactory>
            {...meta}
            {...config}
            {...props}
            currentPluginIndex={-1}
            widgets={activeWidgets}
            storeKeys={currentStoreKeys}
            schemaKeys={currentSchemaKeys}
            requiredList={required}
            required={false}
            errors={errorContainer}
            parentSchema={parentSchema}
            schema={schema as UISchemaMap}
            // `showValidity` is overridable by render flow, e.g. nested Stepper
            showValidity={props.showValidity || showValidity}
            onChange={onChange}
            {...values || {}}
            isVirtual={isVirtual}
            valid
        />

    const wrappedStack = StackWrapper && !isVirtual ?
        <StackWrapper
            schema={schema}
            storeKeys={currentStoreKeys}
            schemaKeys={currentSchemaKeys}
            {...(wrapperProps || {})}
        >{stack}</StackWrapper> :
        stack

    // @ts-ignore
    return props.schema ?
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
        null as unknown as React.ReactElement
}

export const getNextPlugin =
    <C extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory>(
        next: number,
        {widgetPlugins: wps}: W,
    ): WidgetPluginType<C, W> => {
        if (wps && next in wps) {
            return wps[next] as WidgetPluginType<C, W>
        }

        throw new Error(`WidgetPlugin overflow, no plugin at ${next}.`)
    }

export const NextPluginRenderer = <C extends {} = {}, U extends object = object, W extends WidgetsBindingFactory = WidgetsBindingFactory, P extends WidgetPluginProps<W> = WidgetPluginProps<W>>(
    {
        currentPluginIndex,
        ...props
    }: P & C & U,
): React.ReactElement => {
    const next = currentPluginIndex + 1
    const Plugin = getNextPlugin<C, W>(next, props.widgets)
    return <Plugin {...{currentPluginIndex: next, ...props} as P & C & U}/>
}

export const NextPluginRendererMemo = memo(NextPluginRenderer) as <C extends {} = {}, U extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory, P extends WidgetPluginProps<W> = WidgetPluginProps<W>>(props: P & C & U) => React.ReactElement
