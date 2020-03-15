import React from 'react';

import Paper from '@material-ui/core/Paper';
import useTheme from '@material-ui/core/styles/useTheme';
import {ImmutableEditor, themeMaterial} from "react-immutable-editor";
import {SchemaDebug} from "../../component/SchemaDebug";

const MuiJsonEditor = p => {
    const theme = useTheme();
    return <Paper
        square
        variant={'outlined'}
        style={{
            margin: theme.spacing(2) + 'px ' + theme.spacing(1) + 'px',
            padding: '0 ' + theme.spacing(1) + 'px',
        }}
        elevation={0}>

        <ImmutableEditor
            {...p}
            theme={{
                ...themeMaterial,
                type: theme.palette.type,
                base00: theme.palette.background.paper,
                base0D: theme.palette.text.secondary,
                base0B: theme.palette.text.primary,
            }}
        />
    </Paper>
};

const MuiSchemaDebug = p => <SchemaDebug StyledEditor={MuiJsonEditor} {...p}/>;


export {MuiSchemaDebug}
