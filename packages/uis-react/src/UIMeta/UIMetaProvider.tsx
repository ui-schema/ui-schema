import React from 'react'
import { Translator } from '@ui-schema/system/Translator'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { getDisplayName } from '@ui-schema/react/Utils/memo'
import { WidgetsBindingFactory } from '@ui-schema/react/Widgets'

// @ts-ignore
const UIMetaContextObj = React.createContext<UIMetaContext>({})

export interface UIMetaContext<W = WidgetsBindingFactory> {
    widgets: W
    t: Translator
}

export function UIMetaProvider<C extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory>(
    {children, ...props}: React.PropsWithChildren<UIMetaContext<W> & C>,
): React.ReactElement {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const ctx = React.useMemo(() => ({...props}), [...Object.values(props)])
    return <UIMetaContextObj.Provider value={ctx}>
        {children}
    </UIMetaContextObj.Provider>
}

export const useUIMeta = <C extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory>(): UIMetaContext<W> & C => {
    return React.useContext(UIMetaContextObj) as UIMetaContext<W> & C
}

export const withUIMeta = <P extends WidgetProps, C extends {} = {}, W extends WidgetsBindingFactory = WidgetsBindingFactory>(
    Component: React.ComponentType<P & UIMetaContext<W> & C>
): React.ComponentType<P> => {
    const WithUIMeta = (p: P) => {
        const meta = useUIMeta<C, W>()
        return <Component {...meta} {...p}/>
    }
    WithUIMeta.displayName = `WithUIMeta(${getDisplayName(Component)})`
    return WithUIMeta
}
