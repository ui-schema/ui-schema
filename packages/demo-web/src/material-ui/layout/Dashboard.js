import React from 'react';
import clsx from 'clsx';
import {darken} from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {AppDrawer} from '../layout/Drawer';
import {useThemer} from '../component/Theme';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {blueGrey} from '@mui/material/colors';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

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
        background: theme.palette.mode === 'dark' ? darken(theme.palette.primary.dark, 0.8) : theme.palette.primary.main,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    badgeIcon: {
        color: theme.palette.mode === 'dark' ? theme.palette.primary.main : 'inherit',
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
        color: theme.palette.mode === 'dark' ? theme.palette.primary.main : 'inherit',
    },
    drawerRoot: {
        height: '100%',
        overflow: 'auto',
        scrollbarColor: (theme.palette.mode === 'dark' ?
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
        scrollbarColor: (theme.palette.mode === 'dark' ?
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


function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'© '}
            <Link color="inherit" href="https://i-am-digital.eu">
                Michael Becker
            </Link>{' '}
            {new Date().getFullYear()}
        </Typography>
    );
}

export default function Dashboard({children}) {
    const classes = useStyles();
    const switchTheme = useThemer();
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
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>
                <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                        >
                            <MenuIcon className={classes.badgeIcon}/>
                        </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                            Dashboard
                        </Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={0} color="secondary">
                                <NotificationsIcon className={classes.badgeIcon}/>
                            </Badge>
                        </IconButton>
                        <IconButton color="inherit" onClick={switchTheme}>
                            <InvertColorsIcon className={classes.badgeIcon}/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </div>
            <div className={classes.rootContent}>
                <AppDrawer
                    handleDrawerClose={handleDrawerClose}
                    classes={classes}
                    open={open}
                />
                <main className={classes.content}>
                    <Container maxWidth="lg" className={classes.container}z>
                        <Grid container spacing={3}>
                            {children}
                        </Grid>
                        <Box pt={4}>
                            <Copyright/>
                        </Box>
                    </Container>
                </main>
            </div>
        </div>
    );
}
