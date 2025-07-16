import { prependKey, StoreKeys, UIStoreStateData, UIStoreType } from '@ui-schema/react/UIStore'

export const updateStoreScope = <S extends UIStoreType>(
    store: S,
    scope: keyof UIStoreStateData,
    storeKeys: StoreKeys,
    newValue: any,
) => {
    return store.setIn(
        storeKeys.size ? prependKey(storeKeys, scope) : [scope],
        newValue,
    ) as typeof store
}
