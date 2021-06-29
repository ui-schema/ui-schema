import React from 'react'
import { Translator } from '@ui-schema/ui-schema/Translate/makeTranslator'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { WidgetsBindingBase } from '@ui-schema/ui-schema/WidgetsBinding'
import { getDisplayName } from '@ui-schema/ui-schema/Utils/memo'

// @ts-ignore
const UIMetaContextObj = React.createContext<UIMetaContext>({})

export interface UIMetaContextData {
    widgets: WidgetsBindingBase
    t: Translator
}

export type UIMetaContext<C extends {} = {}> = C & UIMetaContextData

export function UIMetaProvider<C extends {} = {}>({children, ...props}: React.PropsWithChildren<UIMetaContext<C>>): React.ReactElement {
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
