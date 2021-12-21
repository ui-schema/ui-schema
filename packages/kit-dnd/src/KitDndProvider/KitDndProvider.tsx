import React from 'react'
import { OnMovedEvent } from '@ui-schema/kit-dnd/Draggable'

export interface KitDndProviderContextType<C extends HTMLElement = HTMLElement> {
    onMoved: <E extends OnMovedEvent<C> = OnMovedEvent<C>>(details: E) => void
    scope?: string
}

// @ts-ignore
export const KitDndProviderContext = React.createContext<KitDndProviderContextType>(undefined)

export const useKitDnd = <C extends HTMLElement = HTMLElement>(): KitDndProviderContextType<C> => React.useContext(KitDndProviderContext)

export const KitDndProvider = <C extends HTMLElement = HTMLElement>(
    {
        children,
        onMoved, scope,
    }: React.PropsWithChildren<KitDndProviderContextType<C>>
): React.ReactElement => {

    const ctx: KitDndProviderContextType = React.useMemo(() => ({
        onMoved, scope,
    }), [
        onMoved, scope,
    ])

    return <KitDndProviderContext.Provider value={ctx}>
        {children}
    </KitDndProviderContext.Provider>
}
//export const KitDndProvider = memo(KitDndProviderBase)
