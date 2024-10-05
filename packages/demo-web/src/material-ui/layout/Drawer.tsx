import React, { ReactNode } from 'react'
import clsx from 'clsx'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import Drawer from '@mui/material/Drawer'
import { NavLink as Link } from 'react-router-dom'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import DashboardIcon from '@mui/icons-material/Dashboard'
import WidgetsIcon from '@mui/icons-material/Widgets'
import LayersIcon from '@mui/icons-material/Layers'
import AssignmentIcon from '@mui/icons-material/Assignment'
import ListItemButton from '@mui/material/ListItemButton'
import IcCode from '@mui/icons-material/Code'
import { routesThemes } from '../../routes'

function ListItemLink(props: { icon: ReactNode, primary: string, to: string, normalLink?: boolean }) {
    const {icon, primary, to, normalLink} = props

    const renderLink = React.useMemo(
        () => React.forwardRef<HTMLAnchorElement>(function AnchorLink(itemProps, ref) {
            return normalLink ?
                <a href={to} ref={ref} {...itemProps} /> :
                <Link to={to} ref={ref} {...itemProps} />
        }),
        [to, normalLink],
    )

    return <ListItemButton component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary}/>
    </ListItemButton>
}

const mainListItems = (<div>
    {routesThemes.map(route =>
        <ListItemLink
            key={route[0]}
            to={route[0]}
            primary={route[1]} icon={route[0] === '/' ? <DashboardIcon/> : <WidgetsIcon/>}
        />,
    )}
    <ListItemLink to={'https://ui-schema.bemit.codes'} primary="Documentation" icon={<LayersIcon/>} normalLink/>
</div>)

const secondaryListItems = (
    <div>
        <ListSubheader inset>Additional</ListSubheader>
        <ListItemLink to={'/mui-slate'} primary="MUI Slate" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-pro'} primary="MUI UI Pro" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-editorjs'} primary="MUI EditorJS" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-dnd'} primary="MUI DnD" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-dnd-grid'} primary="MUI DnD Grid" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-debounced'} primary="MUI Debounced" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-split'} primary="MUI Split" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-read-write'} primary="MUI Read Write" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/kit-dnd'} primary="Kit DnD" icon={<IcCode/>}/>
        <ListItemLink to={'/kit-dnd-grid'} primary="Kit DnD Grid" icon={<IcCode/>}/>
    </div>
)

export const AppDrawer = (props: { classes: { [k: string]: string }, open?: boolean }) => {
    const {classes, open} = props

    return <Drawer
        variant="permanent"
        classes={{
            root: clsx(classes.drawerRoot),
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
    >
        <Divider/>
        <List>{mainListItems}</List>
        <Divider/>
        <List>{secondaryListItems}</List>
    </Drawer>
}
