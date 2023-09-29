import { UISchemaMap } from '@ui-schema/system/Definitions'
import { WidgetProps } from '@ui-schema/react/Widgets'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IcInfo from '@mui/icons-material/Info'
import React from 'react'
import { List } from 'immutable'
import { StoreKeys } from '@ui-schema/system/ValueStore'

export interface InfoRendererProps {
    variant: 'icon' | 'preview' | 'open'
    openAs: 'embed' | 'modal'
    dense?: boolean
    align?: 'right' | 'left'

    schema: UISchemaMap
    storeKeys: StoreKeys
    schemaKeys: StoreKeys | undefined

    valid?: boolean
    errors?: WidgetProps['errors']
}

export type InfoRendererType<P extends InfoRendererProps = InfoRendererProps> = React.ComponentType<P>

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
        {variant === 'icon' ?
            <IconButton
                onClick={() => setOpen(true)}
                size={dense ? 'small' : 'medium'}
                style={{float: align ? align : undefined}}
            >
                <IcInfo/>
            </IconButton> :
            <Button
                onClick={() => setOpen(o => !o)}
            >
                Show Info
            </Button>}

        {openAs === 'modal' ?
            <Dialog open={open} onClose={() => setOpen(false)}>
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
