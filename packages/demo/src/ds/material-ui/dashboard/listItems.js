import React from 'react';
import {
    Link
} from "react-router-dom";
import ListItem from '@material-ui/core/ListItem';
import ListItemIc from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import {makeStyles} from "@material-ui/core";

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
                <Link to={to} ref={ref} {...itemProps} />
        ),
        [to, normalLink],
    );

    return (<ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary}/>
    </ListItem>);
}

export const mainListItems = (<div>
    <ListItemLink to={'/'} primary="Material-UI" icon={<DashboardIcon/>}/>
    <ListItemLink to={'/bootstrap'} primary="Bootstrap" icon={<ShoppingCartIcon/>}/>
    <ListItemLink to={'/pulse'} primary="Pulse" icon={<PeopleIcon/>}/>
    <ListItemLink to={'/ant'} primary="Ant" icon={<BarChartIcon/>}/>
    <ListItemLink to={'https://ui-schema.bemit.codes'} primary="Documentation" icon={<LayersIcon/>} normalLink/>
</div>);

export const secondaryListItems = (
    <div>
        <ListSubheader inset>Additional</ListSubheader>
        <ListItemLink to={'/mui-richtext'} primary="MUI-Rich" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-code'} primary="MUI-Code" icon={<AssignmentIcon/>}/>
        <ListItemLink to={'/mui-pickers'} primary="MUI-Pickers" icon={<AssignmentIcon/>}/>
    </div>
);
