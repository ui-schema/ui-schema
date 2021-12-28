import { ItemSpec } from '@ui-schema/kit-dnd'

export interface DragDropSpec extends ItemSpec {
    listKey?: string
    isDroppable?: boolean
}
