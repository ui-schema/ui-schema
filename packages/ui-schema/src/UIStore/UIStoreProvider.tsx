import React from 'react'
import { List, Map } from 'immutable'
import { addNestKey, onChangeHandler, StoreKeys, UIStoreType } from '@ui-schema/ui-schema/UIStore/UIStore'
import { getDisplayName } from '@ui-schema/ui-schema/Utils/memo'

export interface UIStoreContext {
    store: UIStoreType
    onChange: onChangeHandler
    showValidity?: boolean | undefined
}

// @ts-ignore
const UIStoreContextObj = React.createContext<UIStoreContext>({})

export const UIStoreProvider: React.ComponentType<React.PropsWithChildren<UIStoreContext>> = ({children, ...props}) => {
    return <UIStoreContextObj.Provider value={props}>
        {children}
    </UIStoreContextObj.Provider>
}
export const useUI = (): UIStoreContext => {
    return React.useContext(UIStoreContextObj)
}

export interface WithValue {
    value: any
    internalValue: any
    onChange: UIStoreContext['onChange']
    showValidity: UIStoreContext['showValidity']
}

export interface WithScalarValue {
    value: string | number | boolean | undefined | null
    internalValue: any
    onChange: UIStoreContext['onChange']
    showValidity: UIStoreContext['showValidity']
}

export interface WithValidity {
    validity: any
    onChange: UIStoreContext['onChange']
    showValidity: UIStoreContext['showValidity']
}

export function doExtractValue<S extends UIStoreType>(storeKeys: StoreKeys, store: S): { value: any, internalValue: Map<string, any> } {
    return {
        value:
            storeKeys.size ?
                (Map.isMap(store.getValues()) || List.isList(store.getValues()) ? store.getValues().getIn(storeKeys) : undefined)
                : store.getValues(),
        internalValue:
            storeKeys.size ?
                store.getInternals() ? store.getInternals().getIn(addNestKey('internals', storeKeys)) || Map() : Map()
                : store.getInternals(),
    }
}

export type ExtractValueNonOverwriteProps = Exclude<keyof WithValue, 'showValidity'>
/**
 * HOC to extract the value with the storeKeys, pushing only the component's value and onChange to it, not the whole store
 */
//export const extractValue = <P extends { storeKeys: StoreKeys, showValidity?: boolean }>(Component: React.ComponentType<P & WithValue>): React.ComponentType<Pick<P, Exclude<keyof P, ExtractValueNonOverwriteProps>>> => {
export const extractValue = <P extends WithValue & { storeKeys: StoreKeys }>(Component: React.ComponentType<P>): React.ComponentType<Omit<P, keyof WithValue> & ExtractValueOverwriteProps> => {
    const ExtractValue = (p: Omit<P, keyof WithValue> & ExtractValueOverwriteProps) => {
        const {store, onChange, showValidity} = useUI()
        // @ts-ignore
        return store ? <Component
            // `showValidity` is overridable by render flow, e.g. nested Stepper
            {...p}
            showValidity={p.showValidity || showValidity}
            onChange={onChange}
            {...doExtractValue(p.storeKeys, store)}
        /> : null
    }
    ExtractValue.displayName = `ExtractValue(${getDisplayName(Component)})`
    return ExtractValue
}
export type ExtractValueOverwriteProps = { showValidity?: boolean }
export const extractValidity = <P extends WithValidity & { storeKeys: StoreKeys }>(Component: React.ComponentType<P>): React.ComponentType<Omit<P, keyof WithValidity> & ExtractValueOverwriteProps> => {
    const ExtractValidity = (p: Omit<P, keyof WithValidity> & ExtractValueOverwriteProps) => {
        const {store, onChange, showValidity} = useUI()
        // @ts-ignore
        return <Component
            {...p}
            validity={p.storeKeys.size ? store.getValidity().getIn(p.storeKeys) : store.getValidity()}
            onChange={onChange}
            showValidity={p.showValidity || showValidity}
        />
    }
    ExtractValidity.displayName = `ExtractValidity(${getDisplayName(Component)})`
    return ExtractValidity
}
