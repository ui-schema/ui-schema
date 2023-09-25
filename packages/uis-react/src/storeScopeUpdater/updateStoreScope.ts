import { prependKey, UIStoreStateData, UIStoreType } from '@ui-schema/react/UIStore'
import { StoreKeys } from '@ui-schema/system/ValueStore'

export type ScopeOnChangeHandlerInternal = <S extends UIStoreType>(
    store: S,
    scope: keyof UIStoreStateData,
    storeKeys: StoreKeys,
    newValue: any
) => S

export const updateStoreScope: ScopeOnChangeHandlerInternal = (store, scope, storeKeys, newValue) => {
    return store.setIn(
        // @ts-ignore
        storeKeys.size ? prependKey(storeKeys, scope) : [scope],
        newValue
    )
}
