import { ReactDeco, DecoratorProps } from '@tactic-ui/react/Deco'
import React from 'react'
import { defineLeafEngine, LeafsEngine, LeafsRenderMapping, ReactLeafsNodeSpec } from '@tactic-ui/react/LeafsEngine'
import { WidgetProps } from '@ui-schema/react/Widgets'

export type WidgetPropsMap = { [k: string]: WidgetProps }

export type CustomComponents = {}
export type CustomLeafsRenderMapping<
    TLeafsMapping extends {} = {},
    TComponentsMapping extends {} = {}
> = LeafsRenderMapping<TLeafsMapping, TComponentsMapping>
export type CustomLeafsEngine<
    TLeafsDataMapping extends WidgetPropsMap,
    TComponents extends {},
    TRender extends LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping>, TComponents>,
    TDeco extends ReactDeco<{}, {}, {}>
> = LeafsEngine<TLeafsDataMapping, TComponents, TRender, TDeco>

const {
    LeafsProvider, useLeafs,
} = defineLeafEngine<
    WidgetPropsMap, CustomComponents,
    CustomLeafsRenderMapping<ReactLeafsNodeSpec<WidgetPropsMap>, CustomComponents>,
    ReactDeco<{}, {}>,
    CustomLeafsEngine<WidgetPropsMap, CustomComponents, CustomLeafsRenderMapping<ReactLeafsNodeSpec<WidgetPropsMap>, CustomComponents>, ReactDeco<{}, {}>>
>()

type LeafNodeInjected = 'decoIndex' | 'next' | keyof CustomLeafsEngine<any, any, any, any>

export const WidgetsProvider = LeafsProvider

export function WidgetEngine<
    TLeafsDataMapping extends WidgetPropsMap,
    TDeco extends ReactDeco<{}, {}> = ReactDeco<{}, {}>,
    TLeafData extends TLeafsDataMapping[keyof TLeafsDataMapping] = TLeafsDataMapping[keyof TLeafsDataMapping],
    TComponentsMapping extends {} = {},
    TRender extends CustomLeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping>, TComponentsMapping> = CustomLeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping>, TComponentsMapping>,
    // todo: TProps not only needs to support removing injected, but also allowing overriding those injected
    TProps extends DecoratorProps<NonNullable<TLeafData>, TDeco> = DecoratorProps<NonNullable<TLeafData>, TDeco>,
>(
    props: Omit<TProps, LeafNodeInjected>, // remove the props injected by LeafNode
): React.JSX.Element | null {
    const {deco, render} = useLeafs<TLeafsDataMapping, TComponentsMapping, TRender, TDeco>()
    if (!deco) {
        throw new Error('This LeafNode requires decorators, maybe missed `deco` at the `LeafsProvider`?')
    }

    // `Next` can not be typed in any way I've found (by inferring),
    // as the next decorator isn't yet known, only when wiring up the Deco,
    // thus here no error will be shown, except the safeguard that "all LeafNode injected are somehow passed down".
    const Next = deco.next(0)
    return <Next
        {...props}
        deco={deco}
        render={render}
        next={deco.next}
        decoIndex={0}
    />
}
