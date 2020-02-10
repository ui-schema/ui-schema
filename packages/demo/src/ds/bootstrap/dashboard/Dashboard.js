import React from 'react';
import clsx from 'clsx';
import {darken, makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import InvertColorsIcon from '@material-ui/icons/InvertColors';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {AppDrawer} from "../layout/Drawer";
import {BootstrapDashboard} from "../layout/Main";
import {useThemer} from "../../../component/Theme";
import {blueGrey} from "@material-ui/core/colors";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    },
    rootContent: {
        display: 'flex',
        overflow: 'auto',
        flexGrow: 1,
    },
    rootAppBar: {
        display: 'flex',
        overflow: 'auto',
        flexShrink: 0,
        background: theme.palette.background.paper,
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        background: theme.palette.type === 'dark' ? darken(theme.palette.primary.dark, 0.8) : theme.palette.primary.main,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    badgeIcon: {
        color: theme.palette.type === 'dark' ? theme.palette.primary.main : 'inherit',
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
        color: theme.palette.type === 'dark' ? theme.palette.primary.main : 'inherit',
    },
    drawerRoot: {
        height: '100%',
        overflow: 'auto',
        scrollbarColor: (theme.palette.type === 'dark' ?
                blueGrey[800] + ' ' + darken(blueGrey[900], 0.2) :
                'default'
        ),
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    content: {
        flexGrow: 1,
        height: '100%',
        overflow: 'auto',
        scrollbarColor: (theme.palette.type === 'dark' ?
                blueGrey[800] + ' ' + darken(blueGrey[900], 0.2) :
                'default'
        ),
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
}));

export default function Dashboard(props) {
    const classes = useStyles();
    const {switchTheme} = useThemer();
    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <div className={classes.rootAppBar}>
                <div className={classes.toolbarIcon} style={{marginLeft: '176px'}}>
                    <button className="navbar-toggler" type="button"
                            data-toggle="collapse" data-target="#navbarToggleExternalContent"
                            aria-controls="navbarToggleExternalContent"
                            aria-expanded="false" aria-label="Toggle navigation"
                            onClick={handleDrawerClose}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
                <div position="absolute" className={[classes.appBar, open, classes.appBarShift, 'navbar-expand'].join(' ')}>
                    <div className="navbar">
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                        >
                            <MenuIcon className={classes.badgeIcon}/>
                        </IconButton>
                        <h6 className={classes.title}>
                            Dashboard
                        </h6>
                        <IconButton color="inherit">
                            <div className={["badge", "badge-secondary"].join(' ')}>
                                <NotificationsIcon className={classes.badgeIcon}/>
                            </div>
                        </IconButton>
                        <IconButton color="inherit" onClick={switchTheme}>
                            <InvertColorsIcon className={classes.badgeIcon}/>
                        </IconButton>
                    </div>
                </div>
            </div>
            <div className={classes.rootContent}>
                <AppDrawer
                    handleDrawerClose={handleDrawerClose}
                    classes={classes}
                    open={open}
                />
                <BootstrapDashboard classes={classes} main={props.main}/>
            </div>
        </div>
    );
}
