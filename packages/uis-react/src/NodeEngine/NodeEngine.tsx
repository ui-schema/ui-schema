import React from 'react'
import { List } from 'immutable'
import { getDisplayName, memo } from '@ui-schema/react/Utils/memo'
import { useUIMeta } from '@ui-schema/react/UIMeta'
import { createValidatorErrors } from '@ui-schema/system/ValidatorErrors'
import { ExtractValueOverwriteProps, StoreKeys, useUIConfig, useUIStore, WithValue } from '@ui-schema/react/UIStore'
import { useImmutable } from '@ui-schema/react/Utils/useImmutable'
import { WidgetPluginProps, WidgetPluginType } from '@ui-schema/react/WidgetEngine'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { AppliedWidgetEngineProps } from '@ui-schema/react/applyWidgetEngine'
import { WidgetOverrideType, WidgetProps, WidgetsBindingFactory } from '@ui-schema/react/Widgets'
import { WidgetRendererProps } from '@ui-schema/react/WidgetRenderer'
import { UIStoreActions, useUIStoreActions } from '@ui-schema/react/UIStoreActions'

export type NodeEngineWrapperProps = {
    children: React.ReactNode
    schema: UISchemaMap
    storeKeys: StoreKeys
    schemaKeys: StoreKeys
}

export type NodeEngineInjectProps = 'currentPluginIndex' | 'requiredList' | 'required' | 'errors' | 'valid' | 'storeKeys'/* | 'parentSchema'*/// |
// todo find a better way to define from-plugin injected values as "required" - or shouldn't?
// 'value' | 'onChange' | 'internalValue'

export type NodeEngineProps<W extends WidgetsBindingFactory = WidgetsBindingFactory, PWidget extends WidgetProps = WidgetProps, C extends {} = {}, PWrapper extends {} = {}> =
    AppliedWidgetEngineProps<C, W, PWidget>
    & {

    // listen from a hoisted component for `errors` changing,
    // useful for some performance optimizes like at ds-material Accordions
    // onErrors?: onErrors

    // override widgets of MetaProvider for this particular NodeEngine (passed down at some use cases)
    // widgets?: WidgetsBindingBase

    // override any widget for just this NodeEngine, not passed down further on
    // better use `applyNodeEngine` instead! https://ui-schema.bemit.codes/docs/core-pluginstack#applypluginstack
    // todo: actually `WidgetOverride` is a WidgetRenderer prop - and also passed through the plugins, so should be in PluginProps also - but not in WidgetProps
    WidgetOverride?: WidgetOverrideType<C, PWidget>

    // wraps the whole stack internally, as interfacing for the utility function `injectNodeEngine`
    // only rendered when not "virtual"
    StackWrapper?: React.ComponentType<NodeEngineWrapperProps & PWrapper>

    wrapperProps?: PWrapper
}

// `extractValue` has moved to own plugin `ExtractStorePlugin` since `0.3.0`
// `withUIMeta` and `mema` are not needed for performance optimizing since `0.3.0` at this position
// todo: with the new tactic setup, wouldn't this whole thing be replaced with `LeafNode`?
export const NodeEngine = <PWidget extends WidgetProps = WidgetProps, C extends {} = {}, P extends NodeEngineProps<WidgetsBindingFactory, PWidget, C> = NodeEngineProps<WidgetsBindingFactory, PWidget, C>, U extends {} = {}>(
    {StackWrapper, wrapperProps, ...props}: P// & PWidget
): React.ReactElement => {
    const meta = useUIMeta<C>()
    const config = useUIConfig<U>()
    const {
        parentSchema,
        storeKeys = List([]),
        schemaKeys = List([]),
        schema,
        // todo: fix typing of `NodeEngineProps`
    } = props as unknown as WidgetProps
    // central reference integrity of `storeKeys` for all plugins and the receiving widget, otherwise `useImmutable` is needed more times, e.g. 3 times in plugins + 1x time in widget
    const currentStoreKeys = useImmutable(storeKeys)
    const errorContainer = React.useMemo(() => createValidatorErrors(), [])
    const currentSchemaKeys = useImmutable(schemaKeys)

    // todo: resolving `hidden` here is wrong, must be done after merging schema / resolving referenced
    // @ts-ignore
    const isVirtual = Boolean(props.isVirtual || schema?.get('hidden'))
    // todo: the `plugins` need to be resolved either here, or in the `uiEngine` using ?useLeafs? from tactic?

    const stack =
        // @ts-ignore
        <NextPluginRendererMemo<C, U>
            {...meta}
            {...config}
            {...props}
            currentPluginIndex={-1}
            storeKeys={currentStoreKeys}
            schemaKeys={currentSchemaKeys}
            errors={errorContainer}
            parentSchema={parentSchema}
            schema={schema as UISchemaMap}
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
        /*activeWidgets?.ErrorFallback ?
            <NodeEngineErrorBoundary
                FallbackComponent={activeWidgets.ErrorFallback}
                type={schema.get('type')}
                widget={schema.get('widget')}
                storeKeys={currentStoreKeys}
            >
                {wrappedStack}
            </NodeEngineErrorBoundary> :*/
        wrappedStack :
        null as unknown as React.ReactElement
}

// todo: from input-props, the injected keys must most likely be `never` or partial, depending if they can be overwritten
export function extractValue<A = UIStoreActions, P extends Partial<WithValue<A>> & { storeKeys: StoreKeys } = Partial<WithValue<A>> & { storeKeys: StoreKeys }>(
    Component: React.ComponentType<P>
): React.ComponentType<Omit<P, keyof WithValue<A>> & ExtractValueOverwriteProps> {
    const ExtractValue = (p: Omit<P, keyof WithValue<A>> & ExtractValueOverwriteProps) => {
        const {store, showValidity} = useUIStore()
        const {onChange} = useUIStoreActions()
        const values = store?.extractValues(p.storeKeys)
        // @ts-ignore
        return <Component
            {...p}
            // `showValidity` is overridable by render flow, e.g. nested Stepper
            showValidity={p.showValidity || showValidity}
            onChange={onChange}
            {...values || {}}
        />
    }
    ExtractValue.displayName = `ExtractValue(${getDisplayName(Component)})`
    return ExtractValue
}

export const getNextPlugin =
    <C extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory>(
        next: number,
        {widgetPlugins: wps, WidgetRenderer}: W
    ): WidgetPluginType<C, W> | React.ComponentType<WidgetRendererProps<W>> =>
        wps && next < wps.length ?
            // todo: throw exception here, was: || (() => 'plugin-error') :
            wps[next] as WidgetPluginType<C, W> :
            WidgetRenderer as React.ComponentType<WidgetRendererProps<W>>

export const NextPluginRenderer = <C extends {} = {}, U extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory, P extends WidgetPluginProps<W> = WidgetPluginProps<W>>(
    {
        currentPluginIndex,
        ...props
    }: P & C & U,
): React.ReactElement => {
    const next = currentPluginIndex + 1
    const Plugin = getNextPlugin<C, W>(next, props.widgets)
    // @ts-ignore
    return <Plugin {...props} currentPluginIndex={next}/>
}

export const NextPluginRendererMemo = memo(NextPluginRenderer) as <C extends {} = {}, U extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory, P extends WidgetPluginProps<W> = WidgetPluginProps<W>>(props: P & C & U) => React.ReactElement
