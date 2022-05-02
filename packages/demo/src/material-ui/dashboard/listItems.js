import React from 'react';
import {NavLink as Link} from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemIc from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WidgetsIcon from '@mui/icons-material/Widgets';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import IcCode from '@mui/icons-material/Code';
import makeStyles from '@mui/styles/makeStyles'
import {routesThemes} from '../../routes';

const useListItemStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.type === 'dark' ? theme.palette.primary.main : 'inherit',
    },
}));

const ListItemIcon = props => {
    const classes = useListItemStyles();
    return <ListItemIc classes={classes} {...props}/>;
};

function ListItemLink(props) {
    const {icon, primary, to, normalLink} = props;

    const renderLink = React.useMemo(
        () => React.forwardRef((itemProps, ref) =>
            normalLink ?
                <a href={to} ref={ref} {...itemProps} /> :
                <Link to={to} ref={ref} {...itemProps} />,
        ),
        [to, normalLink],
    );

    return (<ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary}/>
    </ListItem>);
}

export const mainListItems = (<div>
    {routesThemes.map(route =>
        <ListItemLink
            key={route[0]}
            to={route[0]}
            primary={route[1]} icon={route[0] === '/' ? <DashboardIcon/> : <WidgetsIcon/>}
        />,
    )}
    <ListItemLink to={'https://ui-schema.bemit.codes'} primary="Documentation" icon={<LayersIcon/>} normalLink/>
</div>);

export const secondaryListItems = (
    <div>
        <ListSubheader inset>Additional</ListSubheader>
        <ListItemLink to={'/mui-slate'} primary="MUI Slate" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-code'} primary="MUI-Code" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-color'} primary="MUI-Color" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-pickers'} primary="MUI-Pickers" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-pro'} primary="MUI UI Pro" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-editorjs'} primary="MUI EditorJS" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-dnd'} primary="MUI DnD" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-dnd-grid'} primary="MUI DnD Grid" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-editable'} primary="MUI Editable" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-custom'} primary="MUI Custom" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-debounced'} primary="MUI Debounced" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-split'} primary="MUI Split" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-read-write'} primary="MUI Read Write" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/kit-dnd'} primary="Kit DnD" icon={<IcCode/>}/>
        <ListItemLink to={'/kit-dnd-grid'} primary="Kit DnD Grid" icon={<IcCode/>}/>
    </div>
);
