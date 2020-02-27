import makeStyles from "@material-ui/core/styles/makeStyles";

const useEditorStyles = makeStyles(theme => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    editor: {
        position: 'relative',
        '& .DraftEditor-root': {
            padding: ({dense}) =>
                (dense ? theme.spacing(0.375) : theme.spacing(0.75))
                + 'px 0 ' + theme.spacing(0.75) + 'px 0',
            marginTop: theme.spacing(2),
        },
        '& .DraftEditor-editorContainer': {
            display: 'flex',
        },
        '& .public-DraftEditor-content': {
            width: '100%',
        },
        '& .public-DraftStyleDefault-depth0': {
            marginLeft: theme.spacing(0)
        },
        '& .public-DraftStyleDefault-depth1': {
            marginLeft: theme.spacing(2)
        },
        '& .public-DraftStyleDefault-depth2': {
            marginLeft: theme.spacing(4)
        },
        '& .public-DraftStyleDefault-depth3': {
            marginLeft: theme.spacing(6)
        },
        '& .public-DraftStyleDefault-depth4': {
            marginLeft: theme.spacing(8)
        },
    },
    markdown: {
        position: 'absolute',
        top: '0px',
        right: '4px',
        zIndex: 1,
    },
    markdownLabel: {
        position: 'absolute',
        right: 0,
        bottom: '-50%',
        whiteSpace: 'pre',
    },
}));

const useControlStyles = makeStyles(theme => ({
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    controlsTop: {
        position: 'absolute',
        left: theme.spacing(6),
        right: theme.spacing(6),
        zIndex: 2,
        top: ({dense}) =>
            dense ? -5 : -8,
    },
    controlsBottom: {
        marginBottom: theme.spacing(0),
        marginTop: ({dense}) =>
            dense ? theme.spacing(0.375) : theme.spacing(1),
        alignItems: 'flex-start',
    },
    controlsLabel: {
        flexShrink: 0,
        marginRight: 'auto',
    },
    controls: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        margin: '0 auto',
    },
}));

export {useEditorStyles, useControlStyles}
