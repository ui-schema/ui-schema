import { DraggableBlock } from '@ui-schema/material-dnd'
import { addNestKey, StoreKeys } from '@ui-schema/ui-schema'

export type getSourceValuesType = (item: DraggableBlock, storeKeysFrom: StoreKeys, value: any, internal: any) => { value: any, internal: any }

export const getSourceValues: getSourceValuesType = (_item, storeKeysFrom, value, internal) => {
    return {
        value: value.getIn(storeKeysFrom),
        internal: internal.getIn(addNestKey('internals', storeKeysFrom)),
    }
}
