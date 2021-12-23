import React from 'react'
import { ItemSpec, OnMovedEvent } from '@ui-schema/kit-dnd/KitDnd'

export type onMovedType<C extends HTMLElement = HTMLElement, S extends ItemSpec = ItemSpec, E extends OnMovedEvent<C, S> = OnMovedEvent<C, S>> = (details: E) => void

export interface KitDndProviderContextType<C extends HTMLElement = HTMLElement, S extends ItemSpec = ItemSpec> {
    onMove: onMovedType<C, S>
    scope?: string
}

// @ts-ignore
export const KitDndProviderContext = React.createContext<KitDndProviderContextType>(undefined)

export const useKitDnd = <C extends HTMLElement = HTMLElement>(): KitDndProviderContextType<C> => React.useContext(KitDndProviderContext)

export const KitDndProvider = <C extends HTMLElement = HTMLElement, S extends ItemSpec = ItemSpec, CX extends KitDndProviderContextType<C, S> = KitDndProviderContextType<C, S>>(
    {
        children,
        onMove, scope,
    }: React.PropsWithChildren<CX>
): React.ReactElement => {

    const ctx: CX = React.useMemo(() => ({
        onMove, scope,
    }) as CX, [
        onMove, scope,
    ])

    // @ts-ignore
    return <KitDndProviderContext.Provider value={ctx}>
        {children}
    </KitDndProviderContext.Provider>
}
