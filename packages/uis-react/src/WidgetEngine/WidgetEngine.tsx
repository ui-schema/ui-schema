import { ReactDeco, DecoratorProps, ReactBaseDecorator } from '@ui-schema/react/WidgetDecorator'
import React from 'react'
import { LeafsRenderMapping, ReactLeafsNodeSpec } from '@ui-schema/react/Widgets'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { UISchemaMap } from '@ui-schema/system/Definitions'
import { LeafsEngine } from '@ui-schema/react/Widgets'

export type WidgetPropsMap = { [k: string]: WidgetProps }

type CustomComponents = {}
type CustomLeafsDataMapping = {}

// todo: optimize generics usage for easier, `typeof customBinding.leafs` and alike

export const widgetContext: React.Context<LeafsEngine<CustomLeafsDataMapping, CustomComponents, ReactDeco<{}, {}>, LeafsRenderMapping<ReactLeafsNodeSpec<CustomLeafsDataMapping>, CustomComponents, {
    schema?: UISchemaMap
}>>> = React.createContext(undefined as any)

export const useWidgets = <
    TLeafsDataMapping2 extends CustomLeafsDataMapping = CustomLeafsDataMapping,
    TComponents2 extends CustomComponents = CustomComponents,
    TDeco2 extends ReactDeco<{}, {}> = ReactDeco<{}, {}>,
    TRender2 extends LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping2>, TComponents2> = LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping2>, TComponents2>,
>() => {
    return React.useContext<LeafsEngine<TLeafsDataMapping2, TComponents2, TDeco2, TRender2>>(
        widgetContext as unknown as React.Context<LeafsEngine<TLeafsDataMapping2, TComponents2, TDeco2, TRender2>>,
    )
}

export function WidgetsProvider<
    TLeafsDataMapping2 extends CustomLeafsDataMapping = CustomLeafsDataMapping,
    TComponents2 extends CustomComponents = CustomComponents,
    TDeco2 extends ReactDeco<{}, {}> = ReactDeco<{}, {}>,
    TRender2 extends LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping2>, TComponents2> = LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping2>, TComponents2>,
    // todo: integrate a typing which validates that the provided deco-result-props are compatible with props of `TRender2['leafs']`
>(
    {
        children,
        deco, renderMap,
    }: React.PropsWithChildren<LeafsEngine<TLeafsDataMapping2, TComponents2, TDeco2, TRender2>>,
) {
    const ctx = React.useMemo((): LeafsEngine<TLeafsDataMapping2, TComponents2, TDeco2, TRender2> => ({
        deco: deco, renderMap: renderMap,
    }), [deco, renderMap])

    const LeafsContextProvider = (widgetContext as unknown as React.Context<LeafsEngine<TLeafsDataMapping2, TComponents2, TDeco2, TRender2>>).Provider
    return <LeafsContextProvider value={ctx}>{children}</LeafsContextProvider>
}

export type WidgetEngineInjected = 'decoIndex' | 'next' | keyof ReturnType<typeof useWidgets>

/**
 * @todo as the context is accessed inside, this component can't be customized or overwritten,
 *       e.g. also all components using it must be replaced with custom implementations, e.g. `widgets.components.ObjectRenderer`
 */
export function WidgetEngine<
    TLeafsDataMapping extends WidgetPropsMap,
    TDeco extends ReactDeco<{}, {}> = ReactDeco<{}, {}>,
    TLeafData extends TLeafsDataMapping[keyof TLeafsDataMapping] = TLeafsDataMapping[keyof TLeafsDataMapping],
    TComponentsMapping extends {} = {},
    TRender extends LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping>, TComponentsMapping, { schema?: UISchemaMap }> = LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping>, TComponentsMapping, { schema?: UISchemaMap }>,
    // todo: TProps not only needs to support removing injected, but also allowing overriding those injected
    TProps extends DecoratorProps<NonNullable<TLeafData>, TDeco> = DecoratorProps<NonNullable<TLeafData>, TDeco>,
>(
    props: Omit<TProps, WidgetEngineInjected>, // remove the props injected by LeafNode
): React.JSX.Element | null {
    const {deco, renderMap} = useWidgets<TLeafsDataMapping, TComponentsMapping, TDeco, TRender>()
    if (!deco) {
        throw new Error('The WidgetEngine requires decorators, maybe missed `deco` at the `WidgetsProvider`?')
    }

    // `Next` can not be typed in any way I've found (by inferring),
    // as the next decorator isn't yet known, only when wiring up the Deco,
    // thus here no error will be shown, except the safeguard that "all LeafNode injected are somehow passed down".
    const Next = deco.next(0) as ReactBaseDecorator<{ [k in WidgetEngineInjected]: any }>
    return <Next
        {...props}
        /* todo: for a new "PluginStack" with custom/static overwrite,
         *       the `deco` and `renderMap` must be overridable from above, partially but with safe references,
         *       maybe make another component, instead of combining with the "automatic engine",
         *       mostly for easier typings and performance optimizations in regard for other hooks on/in the static one
         */
        deco={deco}
        renderMap={renderMap}
        next={deco.next}
        decoIndex={0}
    />
}
