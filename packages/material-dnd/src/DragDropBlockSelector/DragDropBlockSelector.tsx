import ListItemButton from '@mui/material/ListItemButton'
import MuiList from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import { useBlocks } from '@ui-schema/material-dnd/DragDropBlockProvider'
import { DragDropBlockComponentsBinding } from '@ui-schema/material-dnd/DragDropBlock'
import { beautifyKey } from '@ui-schema/ui-schema/Utils/beautify'

export const DragDropBlockSelector: DragDropBlockComponentsBinding['DndBlockSelector'] = ({onSelect}) => {
    const {blocks} = useBlocks()

    return <>
        <MuiList>
            {Object.keys(blocks).map(blockId => <ListItemButton
                key={blockId}
                dense
                onClick={() => onSelect(blocks[blockId])}
            >
                <ListItemText
                    primary={beautifyKey(blockId)}
                />
            </ListItemButton>)}
        </MuiList>
    </>
}
