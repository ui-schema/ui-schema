import { SomeSchema } from '@ui-schema/system/CommonTypings'
import { StoreKeyType } from '@ui-schema/system/ValueStore'
import { WidgetFieldSchemaProps, WidgetFieldLocationProps } from '@ui-schema/system/Widget'
import { ComponentType, ReactElement, ReactNode } from 'react'
import { List } from 'immutable'
import { memo } from '@ui-schema/react/Utils/memo'
import { UIMetaContext, useUIMeta } from '@ui-schema/react/UIMeta'
import { onErrorHandler } from '@ui-schema/system/ValidatorOutput'
import { StoreKeys, useUIConfig, useUIStore, WithValue } from '@ui-schema/react/UIStore'
import { useImmutable } from '@ui-schema/react/Utils/useImmutable'
import { WidgetEngineErrorBoundary, WidgetPluginType } from '@ui-schema/react/WidgetEngine'
import { WidgetType, WidgetProps, WidgetsBindingFactory } from '@ui-schema/react/Widgets'
import { useUIStoreActions } from '@ui-schema/react/UIStoreActions'

type WidgetEngineRootProps = {
    isRoot: true
}

type WidgetEngineNestedProps = {
    isRoot?: false
} &
    WidgetFieldLocationProps &
    // todo: FieldSchemaProps, or more `parentSchema` should not be optional here, but with strict typings now,
    //       as it is allowed as `undefined` in widgetPayload, it makes problems there (`Required` and `strictNullChecks` removes undefined)
    // Required<WidgetFieldSchemaProps>
    (WidgetFieldSchemaProps &
        {
            schema: WidgetFieldSchemaProps['schema']
            parentSchema: WidgetFieldSchemaProps['parentSchema']
        })

type WidgetEngineRootOrNestedProps =
    WidgetEngineRootProps |
    WidgetEngineNestedProps

export type WidgetEngineWrapperProps = {
    children: ReactNode
    schema: SomeSchema
    storeKeys: StoreKeys
} & WidgetFieldLocationProps

export type WidgetEngineProps<
    PWrapper extends object = object
> =
    Omit<WidgetProps, 'storeKeys' | 'parentSchema' | 'widgets'>
    & WidgetEngineRootOrNestedProps
    & {
    // todo: why is this defined here? this is also mixing up engine and plugin props,
    //       but something which doesn't reach widgets; and atm. it should not get any child error, just errors in the next layer
    onErrors?: onErrorHandler

    // wraps the whole stack internally, as interfacing for the utility function `injectWidgetEngine`
    // only rendered when not "virtual"
    StackWrapper?: ComponentType<WidgetEngineWrapperProps & PWrapper>

    wrapperProps?: PWrapper
}

export type WidgetEngineOverrideProps<
    PWidget extends object = object,
    TWidgetOverride extends WidgetType<any, any> | undefined = undefined,
> =
// todo: here we will run into the issue wit required props injected by plugins;
//       or maybe not if we keep PWidget also in the override type and
//       that works with all other things
    & (TWidgetOverride extends WidgetType<infer InferredPWidget, any> ? InferredPWidget : object)
    & NoInfer<PWidget>
    & {
    // override any widget for just this WidgetEngine, not passed down further on
    // better use `applyWidgetEngine` instead! https://ui-schema.bemit.codes/docs/core-pluginstack#applypluginstack
    // todo: actually `WidgetOverride` is a WidgetRenderer prop - and also passed through the plugins, so should be available in PluginProps?
    WidgetOverride?: TWidgetOverride
}

function isRootProps(props: WidgetEngineRootOrNestedProps): props is WidgetEngineRootProps {
    return props.isRoot === true
}

export const WidgetEngine = <
    PWidget extends object = object,
    TWidgetOverride extends WidgetType<any, any> | undefined = undefined,
    CMeta extends UIMetaContext = UIMetaContext,
    PWrapper extends object = object,
>(props:
      WidgetEngineProps<NoInfer<PWrapper>> &
      Partial<NoInfer<CMeta>> &
      Omit<WidgetEngineOverrideProps<PWidget, TWidgetOverride>, keyof WidgetEngineProps | keyof NoInfer<CMeta> | keyof WithValue>): ReactNode => {
    type U = object
    const {widgets, ...meta} = useUIMeta<NoInfer<CMeta>>()
    const config = useUIConfig<U>()
    const {store, showValidity} = useUIStore()
    const {onChange} = useUIStoreActions()

    const {
        // schema,
        // parentSchema,
        widgets: customWidgets,
        StackWrapper, wrapperProps,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        isRoot,
        ...nestedProps
    } = props

    let schema: SomeSchema
    let parentSchema: SomeSchema | undefined
    let storeKeys: StoreKeys
    if (isRootProps(props)) {
        storeKeys = List<StoreKeyType>([])
        schema = props.schema
        parentSchema = undefined
    } else {
        // todo: remove fallbacks and add hard errors?
        storeKeys = props.storeKeys || List<StoreKeyType>([])
        schema = props.schema
        parentSchema = props.parentSchema
    }

    const values = store?.extractValues(storeKeys)
    // central reference integrity of `storeKeys` for all plugins and the receiving widget, otherwise `useImmutable` is needed more times, e.g. 3 times in plugins + 1x time in widget
    const currentStoreKeys = useImmutable(storeKeys)
    const activeWidgets = customWidgets || widgets

    // todo: resolving `hidden` here is wrong, must be done after merging schema / resolving referenced
    // todo: this should be a WidgetPlugin, which is after the new schema plugin adapter/validator
    //       only the legacy referencing plugins may produce output during e.g. loading,
    //       otherwise mostly Grid plugins add HTMl, which also depend on the merged schema,
    //       thus the `hidden` check can move into a widgetPlugin, checking for that;
    //       don't forget the grid and not adding more empty containers due to hidden children
    //       (only not more, not improving the current situation)
    const isVirtual = Boolean(props.isVirtual || schema?.get('hidden'))

    // todo: directly use getNextPlugin here, but how to ensure there is a memo-ed layer?! telling users to add that as a plugin themself?
    //       or... again adding a store connector widgetPlugin, and here not doing any memo at all (needs try w/ perf. check)

    const stack =
        // <NextPluginRendererMemo<{}, U, WidgetsBindingFactory>
        <NextPluginRendererMemo
            {...meta}
            {...config}
            {...nestedProps}
            currentPluginIndex={-1}
            widgets={activeWidgets}
            storeKeys={currentStoreKeys}
            parentSchema={parentSchema}
            schema={schema}
            // `showValidity` is overridable by render flow, e.g. nested Stepper
            showValidity={props.showValidity || showValidity}
            onChange={onChange}
            {...values || {}} // pass down all extracted, to support extending `extractValues`
            value={values?.value}
            internalValue={values?.internalValue}
            isVirtual={isVirtual}
            valid
        />

    if (!activeWidgets?.widgetPlugins?.length) {
        // todo: TBD, keep failure without context/without widgetsPlugins or allow any thing optional?
        return null
    }

    const wrappedStack = StackWrapper && !isVirtual ?
        <StackWrapper
            schema={schema}
            storeKeys={currentStoreKeys}
            {...(wrapperProps || {}) as PWrapper}
        >{stack}</StackWrapper> :
        stack

    return schema ?
        // todo: move into a WidgetPlugin?
        //       - easier to modify by user
        //       - allows removing `ErrorFallback` from binding, with a configured-component setup
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
    ): WidgetPluginType<C> => {
        if (wps && next in wps) {
            return wps[next] as WidgetPluginType<C>
        }

        throw new Error(`WidgetPlugin overflow, no plugin at ${next}.`)
    }

// todo: replace with some simpler typed replacement for the legacy widgetPlugins,
//       deprecate and migrate to normal usage of `getNextPlugin`
// export const NextPluginRenderer = <C = {}, U extends object = object, W extends WidgetsBindingFactory = WidgetsBindingFactory, P extends WidgetPluginProps<W> = WidgetPluginProps<W>>(
export const NextPluginRenderer = <C extends object>(
    {
        currentPluginIndex,
        ...props
    }: NoInfer<C> & { currentPluginIndex: number } & any & WidgetProps,// WidgetPluginProps2,
): ReactElement => {
    type W = any
    type P = any
    type U = any
    const next = currentPluginIndex + 1
    const Plugin = getNextPlugin<C, W>(next, props.widgets)
    return <Plugin {...{currentPluginIndex: next, ...props} as P & C & U}/>
}

// export const NextPluginRendererMemo = memo(NextPluginRenderer) as <C = {}, U extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory, P extends WidgetPluginProps<W> = WidgetPluginProps<W>>(props: P & C & U) => ReactElement
export const NextPluginRendererMemo = memo(NextPluginRenderer)
