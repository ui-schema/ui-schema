import React from 'react'
import { List } from 'immutable'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { memo, StoreKeys, StoreSchemaType, TransTitle } from '@ui-schema/ui-schema'
import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import { useUID } from 'react-uid'
import { DragDropItemData, handleItemAdd, useDragDropContext } from '@ui-schema/material-rbd/DragDropProvider/useDragDropContext'

export interface SelectionItemProps {
    item: DragDropItemData
    itemId: string
    storeKeys: StoreKeys
    handleClose: () => void
    handleItemAdd: handleItemAdd
}

const SelectionItem = (
    {
        item, itemId,
        storeKeys,
        handleClose, handleItemAdd,
    }: SelectionItemProps
) => {
    return <ListItem
        button
        onClick={() => {
            handleItemAdd(itemId, storeKeys)
            handleClose()
        }}
    >
        <ListItemText primary={
            <TransTitle schema={item} storeKeys={List()} ownKey={itemId}/>
        }/>
    </ListItem>
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
let EditorSelectionDialog = (
    {handleClose, open, storeKeys}:
        { handleClose: () => void, open: boolean, storeKeys: StoreKeys }
) => {
    const {items, handleItemAdd} = useDragDropContext()
    const uid = useUID()
    return <Dialog onClose={handleClose} open={open}>
        <DialogTitle id={'_uis' + uid}>Select Block</DialogTitle>
        <MuiList dense>
            {items.keySeq().toArray().map((itemId: string) =>
                <SelectionItem
                    key={itemId}
                    storeKeys={storeKeys}
                    itemId={itemId}
                    item={items.get(itemId) as StoreSchemaType}
                    handleClose={handleClose}
                    handleItemAdd={handleItemAdd}
                />)}
        </MuiList>
    </Dialog>
}

// @ts-ignore
EditorSelectionDialog = memo(EditorSelectionDialog)
export { EditorSelectionDialog }
