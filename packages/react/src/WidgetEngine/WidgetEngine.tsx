import { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import { StoreKeyType } from '@ui-schema/ui-schema/ValueStore'
import { WidgetPayloadFieldSchema, WidgetPayloadFieldLocation, WidgetPayload } from '@ui-schema/ui-schema/Widget'
import type { ComponentType, ReactNode } from 'react'
import { List } from 'immutable'
import { UIMetaContext, UIMetaContextInternal, useUIMeta } from '@ui-schema/react/UIMeta'
import { onErrorHandler } from '@ui-schema/ui-schema/ValidatorOutput'
import { useUIConfig, useUIStore, WithOnChange, WithValuePlain } from '@ui-schema/react/UIStore'
import type { StoreKeys } from '@ui-schema/ui-schema/ValueStore'
import { useImmutable } from '@ui-schema/react/Utils/useImmutable'
import { NextPluginMemo } from './NextPlugin.js'
import { WidgetEngineErrorBoundary } from './WidgetEngineErrorBoundary.js'
import type { WidgetPluginProps } from '@ui-schema/react/WidgetEngine'
import { WidgetType, WidgetProps } from '@ui-schema/react/Widget'
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
} & WidgetPayloadFieldLocation

export type WidgetEngineProps<
    PWrapper extends object = object
> =
    Omit<WidgetPayload, keyof WidgetPayloadFieldLocation | keyof WidgetPayloadFieldSchema> &
    WidgetEngineRootOrNestedProps &
    {
        /**
         * @todo why is this defined here? this is also mixing up engine and plugin props,
         *       but something which doesn't reach binding; and atm. it should not get any child error, just errors in the next layer
         * @deprecated use `store.extractValidity` to get reported validations
         */
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
        // better use `applyWidgetEngine` instead! https://ui-schema.bemit.codes/docs/react/widgetengine#applypluginstack
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
      Omit<WidgetEngineOverrideProps<PWidget, TWidgetOverride>, keyof WidgetEngineProps | keyof NoInfer<CMeta> | keyof WithValuePlain | keyof WithOnChange>): ReactNode => {
    type U = object
    // todo: Next isn't fully typed with same as incoming props
    const {binding, Next, ...meta} = useUIMeta<NoInfer<CMeta> & UIMetaContextInternal<{}, WidgetPluginProps<{}>>>()
    // eslint-disable-next-line @typescript-eslint/no-deprecated
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

    if (!Next/* || !activeWidgets?.widgetPlugins?.length*/) {
        // todo: TBD, keep failure without context/without widgetsPlugins or allow any thing optional?
        return null
    }

    const stack =
        <NextPluginMemo
            {...meta}
            {...config}
            {...nestedProps}
            Next={Next}

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
