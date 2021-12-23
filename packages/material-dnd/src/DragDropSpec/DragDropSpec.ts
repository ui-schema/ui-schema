import { StoreKeys } from '@ui-schema/ui-schema'
import { ItemSpec } from '@ui-schema/kit-dnd'

export interface DragDropSpec extends ItemSpec {
    storeKeys: StoreKeys
    listKey?: string
    isDroppable?: boolean
}
