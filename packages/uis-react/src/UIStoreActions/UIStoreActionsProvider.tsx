import React from 'react'
import { onChangeHandler } from '@ui-schema/react/UIStore'
import { UIStoreActions } from '@ui-schema/react/UIStoreActions'

export interface UIStoreActionsContext<A = UIStoreActions> {
    onChange: onChangeHandler<A>
}

// @ts-ignore
const UIStoreActionsContextObj = React.createContext<UIStoreActionsContext>({})

export function UIStoreActionsProvider<A = UIStoreActions>(
    {
        children,
        onChange,
    }: React.PropsWithChildren<UIStoreActionsContext<A>>
): React.ReactElement {
    const ctx = React.useMemo(() => ({onChange}), [onChange])
    // @ts-ignore
    return <UIStoreActionsContextObj.Provider value={ctx}>
        {children}
    </UIStoreActionsContextObj.Provider>
}

export function useUIStoreActions<A = UIStoreActions>(): UIStoreActionsContext<A> {
    return React.useContext(UIStoreActionsContextObj) as unknown as UIStoreActionsContext<A>
}
