import React from 'react'
import { onChangeHandler, UIStoreType } from '@ui-schema/react/UIStore'
import { UIStoreActionsContext, UIStoreActionsProvider, UIStoreActions } from '@ui-schema/react/UIStoreActions'

export interface UIStoreContext<D = any> {
    store: UIStoreType<D> | undefined
    showValidity?: boolean
}

// @ts-expect-error initialized in provider
const UIStoreContextObj = React.createContext<UIStoreContext>({})

const UIConfigContextObj = React.createContext<{}>({})

export const UIConfigProvider: React.ComponentType<React.PropsWithChildren<{}>> = (
    {children, ...props},
) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const value = React.useMemo(() => ({...props}), [...Object.values(props)])
    return <UIConfigContextObj.Provider value={value}>
        {children}
    </UIConfigContextObj.Provider>
}

export function UIStoreProvider<C extends {} = {}, D = any, A = UIStoreActions>(
    {
        children,
        showValidity, onChange, store,
        ...props
    }: React.PropsWithChildren<UIStoreContext<D> & UIStoreActionsContext<A> & C>,
): React.ReactElement {
    const ctx = React.useMemo(() => ({showValidity, store}), [showValidity, store])
    return <UIStoreContextObj.Provider value={ctx}>
        <UIConfigProvider {...props}>
            <UIStoreActionsProvider<A> onChange={onChange}>
                {children}
            </UIStoreActionsProvider>
        </UIConfigProvider>
    </UIStoreContextObj.Provider>
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const useUIStore = <D extends any = any>(): UIStoreContext<D> => {
    return React.useContext(UIStoreContextObj)
}

export function useUIConfig<U extends {} = {}>(): U {
    return React.useContext(UIConfigContextObj) as U
}

export interface WithOnChange<A = UIStoreActions> {
    onChange: onChangeHandler<A>
}

export interface WithValue<A = UIStoreActions> {
    /**
     * @todo switch to `unknown`
     */
    value: any | undefined
    /**
     * @todo switch to `unknown`
     */
    internalValue: any | undefined
    showValidity?: UIStoreContext['showValidity']
    onChange: onChangeHandler<A>
}

export interface WithScalarValue<A = UIStoreActions> {
    value: string | number | boolean | undefined | null
    internalValue: any
    showValidity?: UIStoreContext['showValidity']
    onChange: onChangeHandler<A>
}

export interface WithValidity<A = UIStoreActions> {
    validity: any
    onChange: onChangeHandler<A>
    showValidity?: UIStoreContext['showValidity']
}
