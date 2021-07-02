import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import {InvertColors as InvertColorsIcon} from '@material-ui/icons';
import GithubLogo from '../asset/GithubLogo';
import {Link as RouterLink} from 'react-router-dom';
import useTheme from '@material-ui/core/styles/useTheme';
import {AccessTooltipIcon} from '@control-ui/kit/Tooltip';
import Typography from '@material-ui/core/Typography';
import {LinkIconButton} from '@control-ui/kit/Link/LinkIconButton';
import {Header} from '@control-ui/app/Header';
import {useSwitchTheme} from '@control-ui/app/AppTheme';
import {Drawer} from '@control-ui/app/Drawer';
import {useDrawer} from '@control-ui/app/DrawerProvider';
import {ListItemLink} from '@control-ui/kit/List';
import {ListItemIcon} from '@control-ui/kit/List/ListItemIcon';
import {Logo} from '../asset/logo';
import {schemas} from '../schemas/_list';
import ListItemText from '@material-ui/core/ListItemText';
import {ExpandLess, ExpandMore} from '@material-ui/icons';
import {Divider, List, Collapse} from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import {NavListNested} from '@control-ui/kit/Menu/NavList';
import {routesDocs, routesDSMaterial, routesWidgets} from '../content/docs';

const title = '0.3.x'
export const CustomHeader = () => {
    const {switchTheme} = useSwitchTheme();
    return <Header>
        <RouterLink to={'/'}>
            <Logo width={26} style={{marginLeft: 6, display: 'block'}}/>
        </RouterLink>

        {title ? <Typography component="p" variant="h6" style={{flexShrink: 0, margin: '0 auto 0 8px'}}>
            {title}
        </Typography> : null}

        <LinkIconButton size={'medium'} to={'https://github.com/ui-schema/ui-schema'} color="inherit" style={{color: 'inherit', marginLeft: title ? 0 : 'auto'}}>
            <GithubLogo fill="currentColor"/>
            <span className={'sr-only'}>To Github</span>
        </LinkIconButton>

        <IconButton color="inherit" onClick={switchTheme}>
            <AccessTooltipIcon title={'Switch Theme'}>
                <InvertColorsIcon/>
            </AccessTooltipIcon>
        </IconButton>
    </Header>;
};

const CollapseDrawer = ({toggle, icon, children, dense, style = undefined}) => {
    const [open, setOpen] = React.useState(true)
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

export const CustomDrawer = () => {
    const {setOpen} = useDrawer()
    const {breakpoints} = useTheme();
    const closeOnClick = React.useCallback(() => {
        if(breakpoints.width('md') > window.innerWidth) {
            setOpen(false)
        }
    }, [breakpoints, setOpen]);
    return <Drawer drawerWidth={260}>
        <List>
            <ListItemLink to={'/'} primary={'Home'} dense showActive onClick={closeOnClick}/>
            <ListItemLink to={'/quick-start'} primary={'Quick-Start'} dense showActive onClick={closeOnClick}/>
            <ListItemLink to={'/examples'} primary={'Live Editor'} dense showActive onClick={closeOnClick}/>

            <NavListNested
                routes={[routesDocs]}
                dense
                filter={() => true}
                onClick={closeOnClick}
            />
            <NavListNested
                routes={[routesWidgets]}
                dense
                filter={() => true}
                onClick={closeOnClick}
            />
            <NavListNested
                routes={[routesDSMaterial]}
                dense
                filter={() => true}
                onClick={closeOnClick}
            />

            <CollapseDrawer toggle={'Schema Examples'} dense>
                <List component="div" disablePadding style={{overflow: 'auto'}}>
                    {schemas.map((schema, i) => (
                        <ListItemLink
                            key={i} to={'/examples/' + (schemas[i][0].split(' ').join('-'))}
                            primary={schema[0]} style={{paddingLeft: 24}} dense showActive onClick={closeOnClick}/>
                    ))}
                </List>
            </CollapseDrawer>
            <Divider/>
            <ListItemLink to={'/impress'} primary={'Impress'} dense showActive onClick={closeOnClick}/>
            <ListItemLink to={'/privacy'} primary={'Privacy Policy'} dense showActive onClick={closeOnClick}/>
            <Divider/>
        </List>
    </Drawer>;
};
