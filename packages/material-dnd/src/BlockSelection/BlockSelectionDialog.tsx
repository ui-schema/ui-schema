import React from 'react'
import { List } from 'immutable'
import { memo, StoreKeys, StoreSchemaType, TransTitle } from '@ui-schema/ui-schema'
import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import { useUID } from 'react-uid'
import { DragDropBlockData, DragDropAdvancedContextType } from '../DragDropProvider/useDragDropContext'

export interface BlockSelectionProps {
    block: DragDropBlockData
    blockId: string
    storeKeys: StoreKeys
    handleClose: () => void
    handleBlockAdd: DragDropAdvancedContextType['handleBlockAdd']
}

const BlockSelection = (
    {
        block, blockId,
        storeKeys,
        handleClose, handleBlockAdd,
    }: BlockSelectionProps
) => {
    return <ListItem
        button
        onClick={() => {
            handleBlockAdd(blockId, storeKeys)
            handleClose()
        }}
    >
        <ListItemText primary={
            // todo: replace with `<Trans>` compo
            <TransTitle schema={block} storeKeys={List()} ownKey={blockId}/>
        }/>
    </ListItem>
}

export interface EditorSelectionDialogProps {
    handleClose: () => void
    open: boolean
    storeKeys: StoreKeys
    blocks: DragDropAdvancedContextType['blocks']
    handleBlockAdd: DragDropAdvancedContextType['handleBlockAdd']
}

let EditorSelectionDialog: React.ComponentType<EditorSelectionDialogProps> = (
    {blocks, handleBlockAdd, handleClose, open, storeKeys}
) => {
    const uid = useUID()
    return <Dialog onClose={handleClose} open={open}>
        <DialogTitle id={'_uis' + uid}>Select Block</DialogTitle>
        <MuiList dense>
            {blocks?.keySeq().toArray().map((blockId: string) =>
                <BlockSelection
                    key={blockId}
                    storeKeys={storeKeys}
                    blockId={blockId}
                    block={blocks.get(blockId) as StoreSchemaType}
                    handleClose={handleClose}
                    handleBlockAdd={handleBlockAdd}
                />)}
        </MuiList>
    </Dialog>
}

// @ts-ignore
EditorSelectionDialog = memo(EditorSelectionDialog)
export { EditorSelectionDialog }
