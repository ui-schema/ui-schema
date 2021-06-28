import React from 'react'
import { Translator } from '@ui-schema/ui-schema/Translate/makeTranslator'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { WidgetsBindingBase } from '@ui-schema/ui-schema/WidgetsBinding'
import { getDisplayName, memo } from '@ui-schema/ui-schema/Utils/memo'

// @ts-ignore
const UIMetaContextObj = React.createContext<UIMetaContext>({})

export interface UIMetaContext {
    widgets: WidgetsBindingBase
    t: Translator
}

let UIMetaProvider: React.ComponentType<React.PropsWithChildren<UIMetaContext>> = ({children, ...props}) =>
    <UIMetaContextObj.Provider value={props}>
        {children}
    </UIMetaContextObj.Provider>
UIMetaProvider = memo(UIMetaProvider)
export { UIMetaProvider }

export const useUIMeta = (): UIMetaContext => {
    return React.useContext(UIMetaContextObj)
}

export const withUIMeta = <P extends WidgetProps>(Component: React.ComponentType<P & UIMetaContext>): React.ComponentType<P> => {
    const WithUIMeta = (p: P) => {
        const meta = useUIMeta()
        return <Component {...meta} {...p}/>
    }
    WithUIMeta.displayName = `WithUIMeta(${getDisplayName(Component)})`
    return WithUIMeta
}
