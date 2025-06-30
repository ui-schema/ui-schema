import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import { ImmutableEditor, themeMaterial, themeMaterialLight } from 'react-immutable-editor'
import { SchemaDebug } from '../../component/SchemaDebug'
import Typography from '@mui/material/Typography'

export const MuiJsonEditor = ({title, ...p}: any) => {
    const theme = useTheme()
    return <Paper
        square
        variant={'outlined'}
        style={{
            margin: theme.spacing(1.5) + ' ' + theme.spacing(1),
            padding: '0 ' + theme.spacing(1),
        }}
        elevation={0}
    >
        {title ?
            <Typography variant={'subtitle2'} color={'primary'} sx={{my: 0.5}}>{title}</Typography> : null}

        <ImmutableEditor
            {...p}
            theme={{
                ...theme.palette.mode === 'light' ? themeMaterialLight : themeMaterial,
                base00: theme.palette.background.paper,
            }}
        />
    </Paper>
}

export const MuiSchemaDebug = p => <SchemaDebug StyledEditor={MuiJsonEditor} {...p}/>
