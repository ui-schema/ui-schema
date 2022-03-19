import React from 'react'
import { onChangeHandler, UIStoreType } from '@ui-schema/ui-schema/UIStore'
import { UIStoreActionsContext, UIStoreActionsProvider, UIStoreActions } from '@ui-schema/ui-schema/UIStoreActions'

export interface UIStoreContext<D = any> {
    store: UIStoreType<D> | undefined
    showValidity?: boolean
}

// @ts-ignore
const UIStoreContextObj = React.createContext<UIStoreContext>({})

// @ts-ignore
const UIConfigContextObj = React.createContext<{}>({})

export const UIConfigProvider: React.ComponentType<React.PropsWithChildren<{}>> = (
    {children, ...props}
) => {
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
    }: React.PropsWithChildren<UIStoreContext<D> & UIStoreActionsContext<A> & C>
): React.ReactElement {
    // todo: add memo of ctx-value
    return <UIStoreContextObj.Provider value={{showValidity, store}}>
        <UIConfigProvider {...props}>
            <UIStoreActionsProvider<A> onChange={onChange}>
                {children}
            </UIStoreActionsProvider>
        </UIConfigProvider>
    </UIStoreContextObj.Provider>
}

/**
 * @deprecated
 */
export const useUI = (): UIStoreContext => {
    return useUIStore()
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const useUIStore = <D extends any = any>(): UIStoreContext<D> => {
    return React.useContext(UIStoreContextObj)
}

export function useUIConfig<C extends {} = {}>(): C {
    // @ts-ignore
    return React.useContext(UIConfigContextObj)
}

export interface WithOnChange<A = UIStoreActions> {
    onChange: onChangeHandler<A>
}

export interface WithValue<A = UIStoreActions> {
    value: any | undefined
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
