import React from 'react'
import { darken, useTheme } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import MenuIcon from '@mui/icons-material/Menu'
import InvertColorsIcon from '@mui/icons-material/InvertColors'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { AppDrawer, drawerWidth } from './Drawer'
import { useThemer } from '../component/Theme'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            <Link color="inherit" href="https://i-am-digital.eu">
                Michael Becker
            </Link>{' '}
            {new Date().getFullYear()}
        </Typography>
    )
}

export default function Dashboard({children}) {
    const theme = useTheme()
    const switchTheme = useThemer()
    const [open, setOpen] = React.useState(true)

    const handleDrawerOpen = () => {
        setOpen(true)
    }
    const handleDrawerClose = () => {
        setOpen(false)
    }

    const appBarSx = {
        zIndex: theme.zIndex.drawer + 1,
        background: theme.palette.mode === 'dark' ? darken(theme.palette.primary.dark, 0.8) : theme.palette.primary.main,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }

    const badgeIconSx = {
        color: theme.palette.mode === 'dark' ? theme.palette.primary.main : 'inherit',
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
            <Box
                sx={{
                    display: 'flex',
                    overflow: 'auto',
                    flexShrink: 0,
                    bgcolor: 'background.paper',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        padding: '0 8px',
                        ...theme.mixins.toolbar,
                        marginLeft: '176px',
                    }}
                >
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </Box>
                <AppBar position="absolute" sx={appBarSx}>
                    <Toolbar sx={{paddingRight: '24px'}}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            sx={{
                                marginRight: '36px',
                                ...(open && {display: 'none'}),
                            }}
                        >
                            <MenuIcon sx={badgeIconSx}/>
                        </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{flexGrow: 1, color: theme.palette.mode === 'dark' ? theme.palette.primary.main : 'inherit'}}>
                            Dashboard
                        </Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={0} color="secondary">
                                <NotificationsIcon sx={badgeIconSx}/>
                            </Badge>
                        </IconButton>
                        <IconButton color="inherit" onClick={switchTheme}>
                            <InvertColorsIcon sx={badgeIconSx}/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    overflow: 'auto',
                    flexGrow: 1,
                }}
            >
                <AppDrawer
                    open={open}
                />
                <Box
                    sx={{
                        flexGrow: 1,
                        height: '100%',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Container component={'main'} maxWidth="lg" sx={{flexGrow: 1, py: 4}}>
                        {children}
                    </Container>
                    <Box pb={1}>
                        <Copyright/>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
