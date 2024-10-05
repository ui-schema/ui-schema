import React from 'react'
import Paper from '@mui/material/Paper'
import useTheme from '@mui/material/styles/useTheme'
import { ImmutableEditor, themeMaterial } from 'react-immutable-editor'
import { SchemaDebug } from '../../component/SchemaDebug'
import Typography from '@mui/material/Typography'

const MuiJsonEditor = ({title, ...p}: any) => {
    const theme = useTheme()
    return <Paper
        square
        variant={'outlined'}
        style={{
            margin: theme.spacing(2) + ' ' + theme.spacing(1),
            padding: '0 ' + theme.spacing(1),
        }}
        elevation={0}
    >
        {title ?
            <Typography variant={'subtitle2'} color={'primary'} sx={{my: 0.5}}>{title}</Typography> : null}

        <ImmutableEditor
            {...p}
            theme={{
                ...themeMaterial,
                type: theme.palette.mode,
                base00: theme.palette.background.paper,
                base0D: theme.palette.text.secondary,
                base0B: theme.palette.text.primary,
            }}
        />
    </Paper>
}

export const MuiSchemaDebug = p => <SchemaDebug StyledEditor={MuiJsonEditor} {...p}/>
