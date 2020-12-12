import { StoreKeys, UIStoreType } from '@ui-schema/ui-schema'

export interface UpdaterData {
    value?: any
    internal?: any
    valid?: any
}

export type updaterFn = ({value, internal, valid}: UpdaterData) => UpdaterData

export type updateScope = 'value' | 'internal' | 'valid' | string

export function storeUpdater(
    storeKeys: StoreKeys,
    scopes: updateScope[],
    updater: updaterFn,
    deleteOnEmpty?: boolean,
    type?: string,
): (store: UIStoreType) => UIStoreType
