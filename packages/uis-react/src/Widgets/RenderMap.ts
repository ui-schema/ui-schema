import { ReactDeco } from '@ui-schema/react/WidgetDecorator'
import React from 'react'

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type GenericLeafNode<P> = any
export type GenericLeafsDataSpec<D extends {} = {}> = {
    [k: string]: D
}
export type LeafsNodeSpec<LN extends GenericLeafNode<LDS[keyof LDS]>, LDS extends GenericLeafsDataSpec> = {
    [NT in keyof LDS]: LN;
}

export interface LeafsRenderMapping<TLeafsMapping extends {} = {}, TComponentsMapping extends {} = {},
    /**
     * The match params should be wider than the params each leaf expects,
     * to improve portability of matcher to work with similar leafs,
     * as mostly the matcher should work for more leafs than initially known.
     *
     * @example
     *  if some leaf param is:      `{ type: 'headline' | 'input' }`
     *  the match params should be: `{ type: string }`
     */
    TMatchParams extends {} = {},
    /**
     * @experimental
     */
    TMatchResult = any,
    /**
     * @experimental
     */
    THooks extends {} = {}> {
    components: TComponentsMapping
    leafs: TLeafsMapping
    /**
     * Responsible to match leafs of this mapping.
     */
    matchLeaf: <P extends TMatchParams>(params: P, leafs: TLeafsMapping) => TMatchResult
    children?: never
    hooks?: THooks
}

/**
 * A wider `React.ComponentType`, as the remapping had a lot of issues when `React.ComponentType` was used internally, somehow not reproducible here or in others with React18.
 * But in ui-schema with the latest React 18 setup, `React.ComponentType` won't work without the `React.ComponentClass<P>`
 */
export type ReactLeafDefaultNodeType<P = {}> = React.ComponentClass<P> | ((props: P, context?: any) => React.ReactNode)
export type ReactLeafsNodeSpec<LDS extends GenericLeafsDataSpec> = {
    [K in keyof LDS]: ReactLeafDefaultNodeType<NonNullable<LDS[K]>>;
}

export interface LeafsEngine<
    TLeafsDataMapping extends GenericLeafsDataSpec,
    TComponents extends {},
    TDeco extends ReactDeco<{}, {}, {}>,
    TRender extends LeafsRenderMapping<ReactLeafsNodeSpec<TLeafsDataMapping>, TComponents>
> {
    renderMap: TRender
    deco?: TDeco
}
