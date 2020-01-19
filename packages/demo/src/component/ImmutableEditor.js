import React from "react";
import {Paper, useTheme} from "@material-ui/core";
import {ImmutableEditor, themeMaterial} from 'react-immutable-editor';

export default (props) => {
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
            {...props}
            theme={{
                ...themeMaterial,
                type: theme.palette.type,
                base00: theme.palette.background.paper,
                base0D: theme.palette.text.secondary,
                base0B: theme.palette.text.primary,
            }}/>
    </Paper>
};
