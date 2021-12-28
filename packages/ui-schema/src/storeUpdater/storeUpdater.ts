import {
    StoreKeys, UIStoreType,
    prependKey, addNestKey,
    UIStoreStateData,
} from '@ui-schema/ui-schema/UIStore'
import { actionHandler } from '@ui-schema/ui-schema/storeUpdater/storeActionHandler'
import { ScopeUpdaterMapType, storeUpdaterCreate, storeUpdaterType } from '@ui-schema/ui-schema/storeUpdater/storeUpdaterCreate'
import { scopeUpdaterValues, scopeUpdaterInternals, scopeUpdaterValidity } from '@ui-schema/ui-schema/storeScopeUpdater'

const getScopedValueFactory = (scope: keyof UIStoreStateData, nestKey?: string) =>
    <S extends UIStoreType>(storeKeys: StoreKeys, store: S) =>
        store.getIn(
            storeKeys.size ?
                prependKey(nestKey ? addNestKey(nestKey, storeKeys) : storeKeys, scope)
                : [scope]
        )

export const scopeUpdaterMap: ScopeUpdaterMapType = {
    value: {
        // `store.values`
        setter: scopeUpdaterValues,
        getter: getScopedValueFactory('values'),
    },
    internal: {
        // `store.internals`
        setter: scopeUpdaterInternals,
        getter: getScopedValueFactory('internals', 'internals'),
    },
    valid: {
        // `store.validity`
        setter: scopeUpdaterValidity,
        getter: getScopedValueFactory('validity'),
    },
    meta: {
        // `store.meta`
        setter: (store, _storeKeys, newValue) => store.set('meta', newValue),
        getter: (_storeKeys, store) => store.meta,
    },
}

export const storeUpdater: storeUpdaterType = storeUpdaterCreate(actionHandler, scopeUpdaterMap)
