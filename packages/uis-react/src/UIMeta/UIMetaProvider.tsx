import React from 'react'
import { translation, Translator } from '@ui-schema/system/Translator'

// @ts-ignore
const UIMetaContextObj = React.createContext<UIMetaContext>({})

export interface UIMetaContext {
    t: Translator<translation | React.ComponentType>
}

export function UIMetaProvider<C extends {} = {}>(
    {children, ...props}: React.PropsWithChildren<UIMetaContext & C>,
): React.ReactElement {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const ctx = React.useMemo(() => ({...props}), [...Object.values(props)])
    return <UIMetaContextObj.Provider value={ctx}>
        {children}
    </UIMetaContextObj.Provider>
}

export const useUIMeta = <C extends {} = {}>(): UIMetaContext & C => {
    return React.useContext(UIMetaContextObj) as UIMetaContext & C
}

