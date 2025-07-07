import React from 'react'
import type { List, Map, MapOf } from 'immutable'
import type { onChangeHandler, UIStoreType } from './UIStore.js'
import { UIStoreActionsContext, UIStoreActionsProvider, UIStoreActions } from '@ui-schema/react/UIStoreActions'

export interface UIStoreContext<D = any> {
    store: UIStoreType<D> | undefined
    showValidity?: boolean
}

// @ts-expect-error initialized in provider
const UIStoreContextObj = React.createContext<UIStoreContext>({})

const UIConfigContextObj = React.createContext<{}>({})

/**
 * @deprecated will be removed in a future version
 */
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
        {/* eslint-disable-next-line @typescript-eslint/no-deprecated */}
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

/**
 * @deprecated will be removed in a future version
 */
export function useUIConfig<U extends {} = {}>(): U {
    return React.useContext(UIConfigContextObj) as U
}

export interface WithOnChange<A = UIStoreActions> {
    onChange: onChangeHandler<A>
}

/**
 * @todo normalize with `WithValue` once finalized stricter widget/plugin props overall
 */
export interface WithValuePlain {
    value: unknown
    internalValue: unknown
}

/**
 * @deprecated use `WithValuePlain` + `WithOnChange` instead, which is also included in `WidgetProps` now
 */
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

/**
 * @todo remove this typing, `WithValue` should be used with type guards
 * @deprecated use `WithValuePlain` instead
 */
export interface WithScalarValue<A = UIStoreActions> {
    value: string | number | boolean | undefined | null
    internalValue: any
    showValidity?: UIStoreContext['showValidity']
    onChange: onChangeHandler<A>
}

// todo: this type leads to circular references
// type Validity = MapOf<{
//     valid?: boolean
//     children: List<Validity> | Map<string, Validity>
// }>
//
// --- while this leads to "type definition is excessively deep" ---
// type Validity2 = FromJS<{
//     valid?: boolean
//     children: Validity2[] | Record<string, Validity2>
// }>
export type Validity = MapOf<{
    valid?: boolean
    children?: ValidityChildren
    errors?: unknown
}>

/**
 * @todo make stricter, with immutable leads to `error TS2615: Type of property 'children' circularly references itself in mapped type`
 */
type ValidityChildren = Map<string, any> | List<any>

/**
 * @deprecated will be removed in a future version
 */
export interface WithValidity<A = UIStoreActions> {
    validity: Validity | undefined
    onChange: onChangeHandler<A>
    showValidity?: UIStoreContext['showValidity']
}
