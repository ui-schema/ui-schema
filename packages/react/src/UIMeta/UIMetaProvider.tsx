import { useMemoObject } from '@ui-schema/react/Utils/useMemoObject'
import { ValidateFn } from '@ui-schema/ui-schema/Validate'
import { createContext, PropsWithChildren, useContext } from 'react'
import { Translator } from '@ui-schema/ui-schema/Translator'
import { WidgetsBindingFactory } from '@ui-schema/react/Widgets'

const UIMetaContextObj = createContext<UIMetaContext>({
    t: text => text,
})

export interface UIMetaContext<W = WidgetsBindingFactory> {
    binding?: W
    t: Translator
    validate?: ValidateFn
}

export function UIMetaProvider<C extends {}, W = WidgetsBindingFactory>(
    {children, ...props}: PropsWithChildren<
        UIMetaContext<W> &
        NoInfer<C>
    >,
) {
    const ctx = useMemoObject(props)
    return <UIMetaContextObj.Provider value={ctx as UIMetaContext}>
        {children}
    </UIMetaContextObj.Provider>
}

export const useUIMeta = <C extends UIMetaContext = UIMetaContext>(): C => {
    return useContext(UIMetaContextObj) as C
}
