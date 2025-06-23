import { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import { StoreKeyType } from '@ui-schema/ui-schema/ValueStore'
import { WidgetPayloadFieldSchema, WidgetPayloadFieldLocation, WidgetPayload } from '@ui-schema/ui-schema/Widget'
import { ComponentType, ReactElement, ReactNode, useMemo } from 'react'
import { List } from 'immutable'
import { getDisplayName, memo } from '@ui-schema/react/Utils/memo'
import { UIMetaContext, useUIMeta } from '@ui-schema/react/UIMeta'
import { onErrorHandler } from '@ui-schema/ui-schema/ValidatorOutput'
import { StoreKeys, useUIConfig, useUIStore, WithValue } from '@ui-schema/react/UIStore'
import { useImmutable } from '@ui-schema/react/Utils/useImmutable'
import { WidgetEngineErrorBoundary, WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { WidgetType, WidgetProps, WidgetsBindingFactory } from '@ui-schema/react/Widgets'
import { useUIStoreActions } from '@ui-schema/react/UIStoreActions'

type WidgetEngineRootProps = {
    isRoot: true
} & Pick<WidgetPayloadFieldSchema, 'schema'>

type WidgetEngineNestedProps = {
    isRoot?: false
} &
    WidgetPayloadFieldLocation &
    // todo: FieldSchemaProps, or more `parentSchema` should not be optional here, but with strict typings now,
    //       as it is allowed as `undefined` in widgetPayload, it makes problems there (`Required` and `strictNullChecks` removes undefined)
    // Required<WidgetFieldSchemaProps>
    (WidgetPayloadFieldSchema &
        {
            parentSchema: WidgetPayloadFieldSchema['parentSchema']
        })

type WidgetEngineRootOrNestedProps =
    WidgetEngineRootProps |
    WidgetEngineNestedProps

export type WidgetEngineWrapperProps = {
    children: ReactNode
    schema: SomeSchema
    storeKeys: StoreKeys
} & WidgetPayloadFieldLocation

export type WidgetEngineProps<
    PWrapper extends object = object
> =
    Omit<WidgetPayload, keyof WidgetPayloadFieldLocation | keyof WidgetPayloadFieldSchema> &
    WidgetEngineRootOrNestedProps &
    {
        // todo: why is this defined here? this is also mixing up engine and plugin props,
        //       but something which doesn't reach binding; and atm. it should not get any child error, just errors in the next layer
        onErrors?: onErrorHandler

        // wraps the whole stack internally, as interfacing for the utility function `injectWidgetEngine`
        // only rendered when not "virtual"
        StackWrapper?: ComponentType<WidgetEngineWrapperProps & PWrapper>

        wrapperProps?: PWrapper
    } &
    Pick<WidgetProps, 'isVirtual' | 'noGrid'>

export type WidgetEngineOverrideProps<
    PWidget extends object = object,
    TWidgetOverride extends WidgetType<any, any> | undefined = undefined,
> =
// todo: here we will run into the issue wit required props injected by plugins;
//       or maybe not if we keep PWidget also in the override type and
//       that works with all other things
    (TWidgetOverride extends WidgetType<infer InferredPWidget, any> ? InferredPWidget : object) &
    NoInfer<PWidget> &
    {
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
    const {binding, ...meta} = useUIMeta<NoInfer<CMeta>>()
    const config = useUIConfig<U>()
    const {store, showValidity} = useUIStore()
    const {onChange} = useUIStoreActions()

    const {
        binding: customBinding,
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
    const activeWidgets = customBinding || binding

    // todo: resolving `hidden` here is wrong, must be done after merging schema / resolving referenced
    // todo: this should be a WidgetPlugin, which is after the new schema plugin adapter/validator
    //       only the legacy referencing plugins may produce output during e.g. loading,
    //       otherwise mostly Grid plugins add HTMl, which also depend on the merged schema,
    //       thus the `hidden` check can move into a widgetPlugin, checking for that;
    //       don't forget the grid and not adding more empty containers due to hidden children
    //       (only not more, not improving the current situation)
    const isVirtual = Boolean(props.isVirtual || schema?.get('hidden'))

    // todo: directly use getNextPlugin here, but how to ensure there is a memoized layer?! telling users to add that as a plugin themself?
    //       or... again adding a store connector widgetPlugin, and here not doing any memo at all (needs try w/ perf. check)
    //       with migrating to a external store #120 it may be not needed any more at all / the WidgetEngine itself could be memoized instead

    const Next = useNext(activeWidgets?.widgetPlugins)

    if (!Next || !activeWidgets?.widgetPlugins?.length) {
        // todo: TBD, keep failure without context/without widgetsPlugins or allow any thing optional?
        return null
    }

    const stack =
        // <NextPluginRendererMemo<{}, U, WidgetsBindingFactory>
        <RenderMemo
            {...meta}
            {...config}
            {...nestedProps}

            // `showValidity` is overridable by render flow, e.g. nested Stepper
            showValidity={props.showValidity || showValidity}
            onChange={onChange}
            // todo: support adding values via props, e.g. needed for stateless rendering,
            //       could be used by VirtualRenderer (which should be a big focus, as the preferred central validator makes it unnecessary)
            //       keep in mind, this then would need more care when passing props from parent, which previously wasn't necessary,
            //       e.g. the ObjectRenderer passes any value to the children WidgetEngine, and this here prevents that from causing performance issues;
            //       but that will need more care in the future, when someone wants the benefits from store events
            {...values || {}} // pass down all extracted, to support extending `extractValues`
            value={values?.value}
            internalValue={values?.internalValue}
            valid

            Component={Next.Component}
            currentPluginIndex={-1}
            isVirtual={isVirtual}
            binding={activeWidgets}
            storeKeys={currentStoreKeys}
            parentSchema={parentSchema}
            schema={schema}
        />

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

/**
 * A simple replacement for rendering components with immutable props in a memoized way without the component being memoized.
 * To use native memo and its special `isEqual`, which no other hook has and would need extra tracking of prev values and comparing.
 * @experimental
 */
const RenderMemoBase = <P = {}>(
    {Component, ...props}: { Component: ComponentType<Omit<P, 'Component'>> } & Omit<P, 'Component'>,
) => {
    return <Component {...props as Omit<P, 'Component'>}/>
}
const RenderMemo = memo(RenderMemoBase) as typeof RenderMemoBase

/**
 * Super simple PoC for `Next` wrapped widget plugin stack, which should be materialized in binding/context,
 * still using index to provide compatibility with non migrated plugins.
 * @todo finalize, move out of here, be sure to adjust memo like explained above to work here, do we want to memo the first component here?!
 *
 * the only "less overhead" with the same DX is using render functions - which are no longer JSX elements themself,
 * which brings a lot of draw backs in terms of types, hot reload and (imho.) general react best practice,
 * and I think could even break hook usage, due to it being possible that the widgetPlugins change dynamically,
 * which wouldn't be (i think) recognized with normal react un/mounts.
 *
 * type PluginRenderFn = (props: PluginProps, next: PluginRenderFn | null) => ReactNode;
 *
 * function renderPluginChain(plugins: PluginRenderFn[], props: PluginProps): ReactNode {
 *     const invoke = (i: number): ReactNode => {
 *         if (i >= plugins.length) return null
 *         const plugin = plugins[i]
 *         return plugin(props, (nextProps) => invoke(i + 1))
 *     }
 *     return invoke(0)
 * }
 *
 * // here `Next` is the second argument and no longer in `props` itself
 * const MyPlugin: PluginRenderFn = (props, Next) => {
 *     // ... do something with props
 *     return <div>
 *         {Next ? Next(props) : null}
 *     </div>
 * }
 */
const useNext = (widgetPlugins: any[] | undefined | null) => {
    return useMemo(() => {
        let First: {
            Component: any
            plugin: any
            index: number
            name: string
        } | undefined = undefined

        if (widgetPlugins && widgetPlugins.length > 0) {
            for (let i = widgetPlugins.length - 1; i >= 0; i--) {
                const widgetPlugin = widgetPlugins[i]
                const Next = widgetPlugin
                const NextNextComponent = First?.Component
                const name = getDisplayName(Next) || `Plugin${i}`
                const Component = (props: any) => {
                    return <Next
                        {...props}
                        Next={NextNextComponent}
                        currentPluginIndex={i}
                        // currentPluginIndex={props.currentPluginIndex}
                    />
                }
                Component.displayName = `WidgetPlugin(${name})`
                First = {
                    Component,
                    plugin: widgetPlugin,
                    name: name,
                    index: i,
                }
            }
        }

        // todo: decide if this is the best replacement or enforcing using a memo plugin
        //       and not only the First is sometimes needed, but also
        //       just before rendering a widget if the schema was e.g. normalized
        // if (First) {
        //     First.Component = memo(First.Component)
        // }

        return First
    }, [widgetPlugins])
}

export const getNextPlugin =
    <C = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory>(
        next: number,
        {widgetPlugins: wps}: W | undefined = {} as W,
    ): ComponentType<WidgetPluginProps & NoInfer<C>> => {
        if (wps && next in wps) {
            return wps[next] as ComponentType<WidgetPluginProps & NoInfer<C>>
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
    const Plugin = getNextPlugin<C, W>(next, props.binding)
    return <Plugin {...{currentPluginIndex: next, ...props} as P & C & U}/>
}

// export const NextPluginRendererMemo = memo(NextPluginRenderer) as <C = {}, U extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory, P extends WidgetPluginProps<W> = WidgetPluginProps<W>>(props: P & C & U) => ReactElement
export const NextPluginRendererMemo = memo(NextPluginRenderer)
