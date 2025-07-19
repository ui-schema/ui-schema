import * as React from 'react'
import type { PropsWithChildren, ReactElement } from 'react'
import type { onChangeHandler } from '@ui-schema/react/UIStore'
import type { UIStoreActions } from '@ui-schema/react/UIStoreActions'

export interface UIStoreActionsContext<A = UIStoreActions> {
    onChange: onChangeHandler<A>
}

// @ts-expect-error initialized in provider
const UIStoreActionsContextObj = React.createContext<UIStoreActionsContext>({})

export function UIStoreActionsProvider<A = UIStoreActions>(
    {
        children,
        onChange,
    }: PropsWithChildren<UIStoreActionsContext<A>>,
): ReactElement {
    const ctx = React.useMemo(() => ({onChange}), [onChange])

    return <UIStoreActionsContextObj.Provider value={ctx as UIStoreActionsContext}>
        {children}
    </UIStoreActionsContextObj.Provider>
}

export function useUIStoreActions<A = UIStoreActions>(): UIStoreActionsContext<A> {
    return React.useContext(UIStoreActionsContextObj) as unknown as UIStoreActionsContext<A>
}
