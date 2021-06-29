import React from 'react'
import { List, Map } from 'immutable'
import { onChange, StoreKeys, UIStoreType } from '@ui-schema/ui-schema/UIStore/UIStore'
import { createMap, getDisplayName } from '@ui-schema/ui-schema/Utils'

export interface UIStoreContext {
    store: UIStoreType
    onChange: onChange
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

export interface WithValidity {
    validity: any
    onChange: UIStoreContext['onChange']
    showValidity: UIStoreContext['showValidity']
}

/**
 * HOC to extract the value with the storeKeys, pushing only the component's value and onChange to it, not the whole store
 */
export const extractValue = <P extends { storeKeys: StoreKeys, showValidity?: boolean }>(Component: React.ComponentType<P & WithValue>): React.ComponentType<P> => {
    const ExtractValue = (p: P) => {
        const {store, onChange, showValidity} = useUI()
        return store ? <Component
            // `showValidity` is overridable by render flow, e.g. nested Stepper
            {...p}
            showValidity={p.showValidity || showValidity}
            onChange={onChange}
            value={
                p.storeKeys.size ?
                    (Map.isMap(store.getValues()) || List.isList(store.getValues()) ? store.getValues().getIn(p.storeKeys) : undefined)
                    : store.getValues()
            }
            internalValue={
                p.storeKeys.size ? store.getInternals() ? store.getInternals().getIn(p.storeKeys) : createMap() : store.getInternals()
            }
        /> : null
    }
    ExtractValue.displayName = `ExtractValue(${getDisplayName(Component)})`
    return ExtractValue
}

export const extractValidity = <P extends { storeKeys: StoreKeys }>(Component: React.ComponentType<P & WithValidity>): React.ComponentType<P> => {
    const ExtractValidity = (p: P) => {
        const {store, onChange, showValidity} = useUI()
        return <Component
            {...p}
            validity={p.storeKeys.size ? store.getValidity().getIn(p.storeKeys) : store.getValidity()}
            onChange={onChange}
            showValidity={showValidity}
        />
    }
    ExtractValidity.displayName = `ExtractValidity(${getDisplayName(Component)})`
    return ExtractValidity
}
