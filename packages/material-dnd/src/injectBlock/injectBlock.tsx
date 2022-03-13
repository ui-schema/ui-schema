import React from 'react'
import { StoreKeys, useUIStore } from '@ui-schema/ui-schema/UIStore'
import { getDisplayName } from '@ui-schema/ui-schema/Utils/memo'
import { DndBlock, useBlocks } from '@ui-schema/material-dnd/DragDropBlockProvider'
import { matchBlock } from '@ui-schema/material-dnd/DndBlocksRenderer/matchBlock'
import { Map, OrderedMap } from 'immutable'

export interface WithDndBlock {
    block: DndBlock | undefined
    blockId: string | undefined
}

export const injectBlock = <P extends WithDndBlock & {
    storeKeys: StoreKeys
}>(Component: React.ComponentType<P>): React.ComponentType<Omit<P, keyof WithDndBlock>> => {
    const InjectBlock = (
        p: Omit<P, keyof WithDndBlock>
    ) => {
        // todo: optimize/remove block matching, as this could be expensive on big lists and many available blocks
        //       especially as it is re-matching every level in one PluginStack tree, on each change, no matter how deep the change was
        const {blocks} = useBlocks()
        const {store} = useUIStore()
        const val = store?.extractValues(p.storeKeys)
        const block = React.useMemo(() => {
            if (!val || !val.value) return
            if (!OrderedMap.isOrderedMap(val.value) && !Map.isMap(val.value)) {
                console.log(p.storeKeys.toJS(), val)
                throw new Error('Detected non-object in injectBlock, atm. only objects are supported as list elements at storeKeys:' + p.storeKeys.toArray().join('.'))
            }
            //console.log('matchBlock',p.storeKeys.toJS())
            return matchBlock(blocks, val.value as any)
        }, [val, blocks])
        // @ts-ignore
        return store ? <Component
            {...p} block={block?.block} blockId={block?.id}
        /> : null
    }
    InjectBlock.displayName = `InjectBlock(${getDisplayName(Component)})`
    return InjectBlock
}
