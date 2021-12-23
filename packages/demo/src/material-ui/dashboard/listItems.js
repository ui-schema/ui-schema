import React from 'react';
import {NavLink as Link} from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIc from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import WidgetsIcon from '@material-ui/icons/Widgets';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import IcCode from '@material-ui/icons/Code';
import {makeStyles} from '@material-ui/core';
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
        <ListItemLink to={'/mui-richtext'} primary="MUI-Rich" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-slate'} primary="MUI Slate" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-code'} primary="MUI-Code" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-color'} primary="MUI-Color" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-pickers'} primary="MUI-Pickers" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-pro'} primary="MUI UI Pro" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-editorjs'} primary="MUI EditorJS" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-rbd'} primary="MUI RBD" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-dnd'} primary="MUI DnD" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-dnd-grid'} primary="MUI DnD Grid" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-editable'} primary="MUI Editable" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-custom'} primary="MUI Custom" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-debounced'} primary="MUI Debounced" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-split'} primary="MUI Split" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/kit-dnd'} primary="Kit DnD" icon={<IcCode/>}/>
        <ListItemLink to={'/kit-dnd-grid'} primary="Kit DnD Grid" icon={<IcCode/>}/>
    </div>
);
