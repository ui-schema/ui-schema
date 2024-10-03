import React from 'react';
import Paper from '@mui/material/Paper';
import {useTheme} from '@mui/material/styles';
import {ImmutableEditor, themeMaterial} from "react-immutable-editor";
import {SchemaDebug} from "../../component/SchemaDebug";

const MuiJsonEditor = p => {
    const theme = useTheme();
    return <Paper
        square
        variant={'outlined'}
        style={{
            margin: theme.spacing(2) + ' ' + theme.spacing(1),
            padding: '0 ' + theme.spacing(1),
        }}
        elevation={0}>

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
};

export const MuiSchemaDebug = p => <SchemaDebug StyledEditor={MuiJsonEditor} {...p}/>;
