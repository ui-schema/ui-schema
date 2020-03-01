import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {AppBar, Container, Dialog, IconButton, Toolbar, Typography} from "@material-ui/core";
import {Close} from "@material-ui/icons";
import Slide from "@material-ui/core/Slide";

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const PageDialog = ({open, title, handleClose, ToolbarButtons, children}) => {
    const classes = useStyles();

    return <Dialog fullScreen open={open} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                    <Close/>
                </IconButton>
                {title ? <Typography variant="h6" className={classes.title}>
                    {title}
                </Typography> : null}
                {ToolbarButtons ? <ToolbarButtons/> : null}
            </Toolbar>
        </AppBar>
        <Container maxWidth={'md'} fixed style={{display: 'flex', flexDirection: 'column', flexGrow: 2,}}>
            {children}
        </Container>
    </Dialog>
};

export {PageDialog}
