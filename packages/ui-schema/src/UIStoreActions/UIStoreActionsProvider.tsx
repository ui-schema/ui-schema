import React from 'react'
import { onChangeHandler } from '@ui-schema/ui-schema/UIStore'
import { UIStoreActions } from '@ui-schema/ui-schema/UIStoreActions'

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

export const useUIStoreActions = <A extends UIStoreActions = UIStoreActions>(): UIStoreActionsContext<A> => {
    return React.useContext(UIStoreActionsContextObj)
}
