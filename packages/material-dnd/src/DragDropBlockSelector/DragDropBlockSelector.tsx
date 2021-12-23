import React from 'react'
import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { useBlocks } from '@ui-schema/material-dnd/DragDropBlockProvider'
import { DragDropBlockComponentsBinding } from '@ui-schema/material-dnd/DragDropBlock'
import { beautifyKey } from '@ui-schema/ui-schema'

export const DragDropBlockSelector: DragDropBlockComponentsBinding['DndBlockSelector'] = ({onSelect}) => {
    const {blocks} = useBlocks()

    return <>
        <MuiList>
            {Object.keys(blocks).map(blockId => <ListItem
                key={blockId}
                button dense
                onClick={() => onSelect(blocks[blockId])}
            >
                <ListItemText
                    primary={beautifyKey(blockId)}
                />
            </ListItem>)}
        </MuiList>
    </>
}
