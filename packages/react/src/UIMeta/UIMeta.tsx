import { useMemoObject } from '@ui-schema/react/Utils/useMemoObject'
import { matchWidget } from '@ui-schema/ui-schema/matchWidget'
import { ValidateFn } from '@ui-schema/ui-schema/Validate'
import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { Translator } from '@ui-schema/ui-schema/Translator'
import { BindingTypeGeneric } from '@ui-schema/react/Widget'
import { NextWidgetPlugin, useNext } from '@ui-schema/react/WidgetEngine'

export interface UIMetaContextInternal<W = BindingTypeGeneric, P = {}> extends UIMetaContext<W> {
    Next: NextWidgetPlugin<P>
}

export interface UIMetaContext<W = BindingTypeGeneric> extends UIMetaContextBinding<W>, UIMetaContextBase {
}

export interface UIMetaContextBase {
    t: Translator
    validate?: ValidateFn
}

export interface UIMetaContextBinding<W = BindingTypeGeneric> {
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

export function UIMetaProvider<C extends {}, W extends BindingTypeGeneric = BindingTypeGeneric>(
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
        binding: useMemo(() => {
            return {
                ...props.binding,
                // todo: it is rather confusing without a default matchWidget and only a fallback in WidgetRenderer,
                //       which brings hard to debug hidden-widgets, e.g. when FormGroup won't render, but the parent object does.
                //       the baseComponent types should be refactored to include the widgets-interfacing,
                //       improve it when moving the strict-widgets typing out of mui to react-core.
                matchWidget: props.binding?.matchWidget || matchWidget,
            }
        }, [props.binding]),
    })
    return <UIMetaContextObj.Provider value={ctx}>
        {children}
    </UIMetaContextObj.Provider>
}

export const useUIMeta = <C extends UIMetaContextInternal<any, any> = UIMetaContextInternal>(): C => {
    return useContext(UIMetaContextObj) as C
}
