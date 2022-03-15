import { UIStoreUpdaterFn } from '@ui-schema/ui-schema/UIStore'
import { UIStoreActions, UIStoreUpdaterData } from '@ui-schema/ui-schema/UIStoreActions'
import { storeActionReducers } from '@ui-schema/ui-schema/storeUpdater/storeActionReducers'

/**
 * @deprecated use `storeActionReducers` instead
 */
export const storeActionHandler = storeActionReducers as <D extends UIStoreUpdaterData = UIStoreUpdaterData, A extends UIStoreActions<D> = UIStoreActions<D>>(action: A) => UIStoreUpdaterFn<D> | D
