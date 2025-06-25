import { useMemoObject } from '@ui-schema/react/Utils/useMemoObject'
import { ValidateFn } from '@ui-schema/ui-schema/Validate'
import { createContext, PropsWithChildren, useContext } from 'react'
import { Translator } from '@ui-schema/ui-schema/Translator'
import { WidgetsBindingFactory } from '@ui-schema/react/Widgets'
import { NextWidgetPlugin, useNext } from '@ui-schema/react/WidgetEngine'

export interface UIMetaContextInternal<W = WidgetsBindingFactory, P = {}> extends UIMetaContext<W> {
    Next: NextWidgetPlugin<P>
}

export interface UIMetaContext<W = WidgetsBindingFactory> extends UIMetaContextBinding<W>, UIMetaContextBase {
}

export interface UIMetaContextBase {
    t: Translator
    validate?: ValidateFn
}

export interface UIMetaContextBinding<W = WidgetsBindingFactory> {
    binding?: W
}

const UIMetaContextObj = createContext<UIMetaContextInternal<any, any>>({
    t: text => text,
    // todo: this obj. is awful as solution for no-widgets/no-context rendering, even for tests
    // initialized with some dummy Next, for context-less tests
    Next: {
        name: 'WidgetOverrideRenderer',
        index: -1,
        plugin: null,
        Component: ({WidgetOverride, ...props}) => WidgetOverride ? <WidgetOverride {...props}/> : null,
    },
})

export function UIMetaProvider<C extends {}, W extends WidgetsBindingFactory = WidgetsBindingFactory>(
    {children, ...props}: PropsWithChildren<
        UIMetaContext<W> &
        Omit<NoInfer<C>, keyof UIMetaContext<W> | 'children'>
    >,
) {
    const Next = useNext(
        props.binding?.WidgetRenderer,
        props.binding?.widgetPlugins,
    )
    const ctx = useMemoObject({
        ...props,
        Next: Next,
    })
    return <UIMetaContextObj.Provider value={ctx}>
        {children}
    </UIMetaContextObj.Provider>
}

export const useUIMeta = <C extends UIMetaContextInternal<any, any> = UIMetaContextInternal>(): C => {
    return useContext(UIMetaContextObj) as C
}
