import { StoreKeys, StoreSchemaType, WidgetProps } from '@ui-schema/ui-schema'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import IcInfo from '@material-ui/icons/Info'
import React from 'react'
import { List } from 'immutable'

export interface InfoRendererProps {
    variant: 'icon' | 'preview' | 'open'
    openAs: 'embed' | 'modal'
    dense?: boolean
    align?: 'right' | 'left'

    schema: StoreSchemaType
    storeKeys: StoreKeys

    valid?: boolean
    errors?: WidgetProps['errors']
}

export const InfoRenderer: React.ComponentType<InfoRendererProps> = (
    {
        schema, variant, openAs,
        align, dense,
    }
) => {
    const [open, setOpen] = React.useState(false)
    const content = <>
        {List.isList(schema.get('info')) ?
            (schema.get('info') as List<string>).map((line, i) =>
                <Typography key={i} gutterBottom>{line}</Typography>).valueSeq() :
            typeof schema.get('info') === 'string' ? schema.get('info') : null}
    </>
    return <>
        {variant === 'icon' ? <IconButton
            onClick={() => setOpen(true)}
            size={dense ? 'small' : 'medium'}
            style={{float: align ? align : undefined}}
        >
            <IcInfo/>
        </IconButton> : <Button
            onClick={() => setOpen(o => !o)}
        >
            Show Info
        </Button>}

        {openAs === 'modal' ? <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Info</DialogTitle>
            <DialogContent>
                {content}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>close</Button>
            </DialogActions>
        </Dialog> : open ? content : null}
    </>
}
