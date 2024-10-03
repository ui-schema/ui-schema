import React from 'react'
import { useTheme } from '@mui/material/styles'
import { Drawer } from '@control-ui/app/Drawer'
import { useDrawer } from '@control-ui/app/DrawerProvider'
import { ListItemLink } from '@control-ui/kit/List'
import ListItemIcon from '@mui/material/ListItemIcon'
import { schemas } from '../schemas/_list'
import ListItemText from '@mui/material/ListItemText'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import Collapse from '@mui/material/Collapse'
import ListItem from '@mui/material/ListItem'
import { NavListItemAuto, NavListNested } from '@control-ui/kit/NavList'
import { routesCore, routesFurtherAddOns, routesFurtherDesignSystem } from '../content/docs'
import { useConsent } from '@bemit/consent-ui-react'
import { Route } from '@control-ui/routes'

const CollapseDrawer: React.ComponentType<React.PropsWithChildren<{
    toggle: string | React.ReactElement
    icon?: React.ReactElement
    dense?: boolean
    initialOpen?: boolean
    style?: React.CSSProperties
}>> = (
    {
        toggle, icon,
        children,
        dense, initialOpen = true, style,
    },
) => {
    const [open, setOpen] = React.useState(initialOpen)
    return <React.Fragment>
        <ListItem button onClick={() => setOpen(o => !o)} dense={dense} style={style}>
            {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
            <ListItemText primary={toggle}/>
            {open ? <ExpandLess/> : <ExpandMore/>}
        </ListItem>

        <Collapse in={open} timeout="auto" unmountOnExit>
            {children}
        </Collapse>
    </React.Fragment>
}

const NavListItemAutoMemo = React.memo(NavListItemAuto)

export const LayoutDrawerBase: React.ComponentType = () => {
    const {toggleUi} = useConsent()
    const {setOpen} = useDrawer()
    const {breakpoints} = useTheme()
    const closeOnClick = React.useCallback(() => {
        if (breakpoints.values.md > window.innerWidth) {
            setOpen(false)
        }
    }, [breakpoints, setOpen])
    const routeFiler = React.useCallback((route: Route) => {
        return Boolean(route.nav)
    }, [])
    return <Drawer drawerWidth={260}>
        <List>
            <ListItemLink to={'/'} primary={'Home'} dense disableNavLink={false} exact onClick={closeOnClick}/>
            <ListItemLink to={'/quick-start'} primary={'Quick-Start'} dense disableNavLink={false} onClick={closeOnClick}/>
            <ListItemLink to={'/examples'} primary={'Live Editor'} dense disableNavLink={false} onClick={closeOnClick}/>
            <Divider/>
            <NavListNested
                // @ts-ignore
                routes={routesCore}
                filter={routeFiler}
                dense
                onClick={closeOnClick}
                ListItem={NavListItemAutoMemo}
                unmountOnExit
            />
            <ListItemLink to={'/updates'} primary={'Updates & Migration'} dense disableNavLink={false} onClick={closeOnClick}/>
            <Divider/>
            <NavListNested
                // @ts-ignore
                routes={routesFurtherDesignSystem}
                filter={routeFiler}
                dense
                onClick={closeOnClick}
                ListItem={NavListItemAutoMemo}
                unmountOnExit
            />
            <Divider/>
            <NavListNested
                routes={routesFurtherAddOns}
                filter={routeFiler}
                dense
                onClick={closeOnClick}
                ListItem={NavListItemAutoMemo}
                unmountOnExit
            />

            <CollapseDrawer toggle={'Schema Examples'} dense initialOpen={false}>
                <List component="div" disablePadding style={{overflow: 'auto'}}>
                    {schemas.map((schema, i) => (
                        <ListItemLink
                            // @ts-ignore
                            key={i} to={'/examples/' + (schemas[i][0].split(' ').join('-'))}
                            // @ts-ignore
                            primary={schema[0]} style={{paddingLeft: 24}} dense disableNavLink={false} onClick={closeOnClick}/>
                    ))}
                </List>
            </CollapseDrawer>
            <Divider/>
            <ListItemLink to={'/impress'} primary={'Impress'} dense disableNavLink={false} onClick={closeOnClick}/>
            <ListItemLink to={'/privacy'} primary={'Privacy Policy'} dense disableNavLink={false} onClick={closeOnClick}/>
            <ListItem button onClick={() => toggleUi()} dense>
                <ListItemText primary={'Privacy Settings'} primaryTypographyProps={{variant: 'body2'}}/>
            </ListItem>
            <Divider/>
        </List>
    </Drawer>
}

export const LayoutDrawer = React.memo(LayoutDrawerBase)
