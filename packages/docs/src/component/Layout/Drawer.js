import clsx from "clsx";
import {makeStyles, Divider, List, Drawer, Collapse,} from "@material-ui/core";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import React from "react";
import {useTranslation} from 'react-i18next';
import {ListItemIcon, ListItemLink} from "../Link";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import {contentDocs, contentDocsWidgets} from "../../content/docs";
import {schemas} from "../../schemas/_list";

const DrawerContext = React.createContext([]);

const useDrawer = () => React.useContext(DrawerContext);

const DrawerProvider = ({children} = {}) => {
    const contextState = React.useState(() => 800 < window.innerWidth);

    return <DrawerContext.Provider value={contextState}>
        {children}
    </DrawerContext.Provider>
};

const drawerWidth = 260;

const useStyles = makeStyles(theme => ({
    drawerRoot: {
        overflow: 'auto',
        position: 'absolute',
        top: 48,
        bottom: 0,
        [theme.breakpoints.up('md')]: {
            height: '100%',
            position: 'relative',
            top: 0,
        }
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
        width: 0,
        [theme.breakpoints.up('sm')]: {
            width: 0,
        },
    },
}));

const CollapseDrawer = ({toggle, icon, children, dense, initial = true, style = undefined}) => {
    const [open, setOpen] = React.useState(initial);

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
};

const DrawerList = ({toggle, contentMap, prefix, handleClick}) => {
    const {i18n} = useTranslation();

    return <CollapseDrawer toggle={toggle} dense>
        <List component="div" disablePadding>
            {contentMap.map((item, i) =>
                !Array.isArray(item) ?
                    <CollapseDrawer key={i} toggle={item.title} dense initial={false} style={{paddingLeft: 36}}>
                        {item.items.map((item, i) =>
                            <ListItemLink key={i} to={'/' + i18n.language + '/' + prefix + item[0]} primary={item[1]} style={{paddingLeft: 52}} dense showActive onClick={handleClick}/>
                        )}
                    </CollapseDrawer> :
                    <ListItemLink key={i} to={'/' + i18n.language + '/' + prefix + item[0]} primary={item[1]} style={{paddingLeft: 36}} dense showActive onClick={handleClick}/>
            )}
        </List>
    </CollapseDrawer>
};

const AppDrawer = () => {
    const classes = useStyles();
    const {i18n} = useTranslation();
    const [open, setDrawerOpen] = useDrawer();

    const closeOnClick = () => window.innerWidth < 960 ? setDrawerOpen(false) : undefined;

    return <Drawer
        variant="persistent"
        className={open ? undefined : 'sr-only'}
        classes={{
            root: clsx(classes.drawerRoot),
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
    >
        <List>
            <ListItemLink to={'/' + i18n.language} primary={'Home'} dense showActive onClick={closeOnClick}/>
            <ListItemLink to={'/' + i18n.language + '/quick-start'} primary={'Quick-Start'} dense showActive onClick={closeOnClick}/>
            <ListItemLink to={'/' + i18n.language + '/examples'} primary={'Live Editor'} dense showActive onClick={closeOnClick}/>

            <DrawerList toggle={'Documentation'} contentMap={contentDocs} prefix={'docs/'} handleClick={closeOnClick}/>
            <DrawerList toggle={'Widgets'} contentMap={contentDocsWidgets} prefix={'docs/'} handleClick={closeOnClick}/>

            <CollapseDrawer toggle={'Schema Examples'} dense>
                <List component="div" disablePadding style={{overflow: 'auto'}}>
                    {schemas.map((schema, i) => (
                        <ListItemLink
                            key={i} to={'/' + i18n.language + '/examples/' + (schemas[i][0].split(' ').join('-'))}
                            primary={schema[0]} style={{paddingLeft: 36}} dense showActive onClick={closeOnClick}/>
                    ))}
                </List>
            </CollapseDrawer>
            <Divider/>
            <ListItemLink to={'/' + i18n.language + '/impress'} primary={'Impress'} dense showActive onClick={closeOnClick}/>
            <ListItemLink to={'/' + i18n.language + '/privacy'} primary={'Privacy Policy'} dense showActive onClick={closeOnClick}/>
            <Divider/>
        </List>
    </Drawer>
};

export {AppDrawer, DrawerProvider, useDrawer}
