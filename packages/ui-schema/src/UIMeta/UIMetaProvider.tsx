import React from 'react'
import { Translator } from '@ui-schema/ui-schema/Translate/makeTranslator'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { WidgetsBindingBaseStrict } from '@ui-schema/ui-schema/WidgetsBinding'
import { getDisplayName } from '@ui-schema/ui-schema/Utils/memo'

// @ts-ignore
const UIMetaContextObj = React.createContext<UIMetaContext>({})

// todo: make widget typings better overridable
export interface UIMetaContextData<W extends {} = {}> {
    widgets: WidgetsBindingBaseStrict & W
    t: Translator
}

export type UIMetaContext<C extends {} = {}, W extends {} = {}> = C & UIMetaContextData<W>

export function UIMetaProvider<C extends {} = {}, W extends {} = {}>({children, ...props}: React.PropsWithChildren<UIMetaContext<C, W>>): React.ReactElement {
    return <UIMetaContextObj.Provider value={props}>
        {children}
    </UIMetaContextObj.Provider>
}

export const useUIMeta = <C extends {} = {}>(): UIMetaContext<C> => {
    // @ts-ignore
    return React.useContext<UIMetaContext<C>>(UIMetaContextObj)
}

export const withUIMeta = <P extends WidgetProps, C extends {} = {}>(Component: React.ComponentType<P & UIMetaContext<C>>): React.ComponentType<P> => {
    const WithUIMeta = (p: P) => {
        const meta = useUIMeta<C>()
        return <Component {...meta} {...p}/>
    }
    WithUIMeta.displayName = `WithUIMeta(${getDisplayName(Component)})`
    return WithUIMeta
}
