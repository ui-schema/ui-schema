import { ValidateFn } from '@ui-schema/system/Validate'
import { ComponentType, createContext, PropsWithChildren, useContext, useRef } from 'react'
import { Translator } from '@ui-schema/system/Translator'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { getDisplayName } from '@ui-schema/react/Utils/memo'
import { WidgetsBindingFactory } from '@ui-schema/react/Widgets'

// @ts-expect-error initialized in provider
const UIMetaContextObj = createContext<UIMetaContext>({})

export interface UIMetaContext<W = WidgetsBindingFactory> {
    widgets: W
    t: Translator
    validate?: ValidateFn
}

const useMemoObject = <O extends object>(currentObject: O) => {
    const obj = useRef(currentObject)

    if (Object.keys(currentObject).some(k => currentObject[k] !== obj[k])) {
        obj.current = currentObject
    }

    return obj.current
}

export function UIMetaProvider<C extends UIMetaContext = UIMetaContext, W extends WidgetsBindingFactory = WidgetsBindingFactory>(
    {children, ...props}: PropsWithChildren<C & Pick<UIMetaContext<W>, 'widgets'>>,
) {
    const ctx = useMemoObject(props)
    return <UIMetaContextObj.Provider value={ctx}>
        {children}
    </UIMetaContextObj.Provider>
}

export const useUIMeta = <C extends UIMetaContext = UIMetaContext, W extends WidgetsBindingFactory = WidgetsBindingFactory>(): C & Pick<UIMetaContext<W>, 'widgets'> => {
    return useContext(UIMetaContextObj) as C & Pick<UIMetaContext<W>, 'widgets'>
}

export const withUIMeta = <P extends WidgetProps, C extends UIMetaContext, W extends WidgetsBindingFactory = WidgetsBindingFactory>(
    Component: ComponentType<P & C & Pick<UIMetaContext<W>, 'widgets'>>,
): ComponentType<P> => {
    const WithUIMeta = (p: P) => {
        const meta = useUIMeta<C, W>()
        return <Component {...meta} {...p}/>
    }
    WithUIMeta.displayName = `WithUIMeta(${getDisplayName(Component)})`
    return WithUIMeta
}
