import { UIStoreType, UIStoreUpdaterFn } from '@ui-schema/ui-schema/UIStore'
import { UIStoreActions, UIStoreUpdaterData } from '@ui-schema/ui-schema/UIStoreActions'
import { storeActionReducers } from '@ui-schema/ui-schema/storeUpdater'

/**
 * @deprecated use `storeActionReducers` instead
 */
export const storeActionHandler = storeActionReducers as <S extends UIStoreType = UIStoreType, D extends UIStoreUpdaterData = UIStoreUpdaterData, A = UIStoreActions<S, D>>(action: A) => UIStoreUpdaterFn<D> | D
