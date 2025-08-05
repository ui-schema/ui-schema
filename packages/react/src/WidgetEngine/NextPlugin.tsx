import { getDisplayName, memo } from '@ui-schema/react/Utils/memo'
import type { MinimalComponentType } from '@ui-schema/react/Widget'
import type { ReactNode } from 'react'
import * as React from 'react'
import type { WidgetPluginProps } from './WidgetPlugin.js'

export type NextWidgetPlugin<P = {}> = {
    Component: <P2 extends P = P>(props: P2) => ReactNode
    plugin: any
    index: number
    name: string
}

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
export const useNext = <PWidgetPlugin extends WidgetPluginProps>(
    WidgetRenderer: MinimalComponentType<PWidgetPlugin> | undefined | null,
    widgetPlugins: MinimalComponentType<PWidgetPlugin>[] | undefined | null,
) => {
    return React.useMemo(() => {
        return makeNext(WidgetRenderer, widgetPlugins)
    }, [WidgetRenderer, widgetPlugins])
}

export const makeNext = <PWidgetPlugin extends WidgetPluginProps>(
    WidgetRenderer: MinimalComponentType<PWidgetPlugin> | undefined | null,
    widgetPlugins: MinimalComponentType<PWidgetPlugin>[] | undefined | null,
) => {
    let First: NextWidgetPlugin<Omit<PWidgetPlugin, 'Next'>> | undefined = undefined

    const WidgetRendererNext: NextWidgetPlugin<Omit<PWidgetPlugin, 'Next'>> = {
        index: widgetPlugins?.length ? widgetPlugins.length - 1 : 0,
        name: '$WidgetRenderer',
        Component: WidgetRenderer as NextWidgetPlugin<Omit<PWidgetPlugin, 'Next'>>['Component'],
        plugin: null,
    }

    if (widgetPlugins && widgetPlugins.length > 0) {
        for (let i = widgetPlugins.length - 1; i >= 0; i--) {
            const widgetPlugin = widgetPlugins[i]
            const Next = widgetPlugin
            const NextNextComponent = First || {
                ...WidgetRendererNext,
                Component: WidgetRendererNext.Component || (() => {
                    throw new Error(`WidgetPlugin overflow, no plugin at ${i + 1}.`)
                }) as MinimalComponentType<PWidgetPlugin>,
            }
            const name = getDisplayName(Next) || `Plugin${i}`
            const Component = (props: any) => {
                return <Next
                    {...props}
                    Next={NextNextComponent}
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

    if (!First) {
        First = {
            ...WidgetRendererNext,
            Component: WidgetRendererNext.Component || (() => {
                throw new Error(`WidgetPlugin overflow, no plugins and no WidgetRenderer.`)
            }),
        }
    }

    // todo: decide if this is the best replacement or enforcing using a memo plugin
    //       and not only the First is sometimes needed, but also
    //       just before rendering a widget if the schema was e.g. normalized
    // if (First) {
    //     First.Component = memo(First.Component)
    // }

    return First
}

export const NextPlugin = <P extends WidgetPluginProps>(props: P): ReactNode => {
    const Next = props.Next
    return <Next.Component {...props}/>
}

export const NextPluginMemo = memo(NextPlugin) as typeof NextPlugin
