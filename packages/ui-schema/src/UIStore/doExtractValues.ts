import { List, Map } from 'immutable'
import { addNestKey, StoreKeys, UIStoreInternalsType, UIStoreType } from '@ui-schema/ui-schema/UIStore'

export type ExtractValueOverwriteProps = { showValidity?: boolean }

export function doExtractValues<S extends UIStoreType>(storeKeys: StoreKeys, store: S): { value: any, internalValue: UIStoreInternalsType } {
    return {
        value:
            storeKeys.size ?
                (Map.isMap(store.getValues()) || List.isList(store.getValues()) ? store.getValues().getIn(storeKeys) : undefined) :
                store.getValues(),
        internalValue:
            storeKeys.size ?
                store.getInternals().getIn(addNestKey('internals', storeKeys)) as UIStoreInternalsType || Map() :
                store.getInternals(),
    }
}
