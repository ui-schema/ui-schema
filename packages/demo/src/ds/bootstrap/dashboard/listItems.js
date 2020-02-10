import React from 'react';
import {
    Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import ListItemIc from '@material-ui/core/ListItemIcon';
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

    const RenderLink = React.useMemo(
        () => React.forwardRef((itemProps, ref) =>
            normalLink ?
                <a href={to} ref={ref} {...itemProps} /> :
                <Link to={to} ref={ref} {...itemProps} />
        ),
        [to, normalLink],
    );

    return (<li>
        <button className={['list-group-item', 'list-group-item-action', 'text-primary'].join(' ')}>
            <RenderLink/>
            {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
            {primary}
        </button>
    </li>);
}

export const mainListItems = (<div>
    <ListItemLink to={'/'} primary="Material-UI" icon={<DashboardIcon/>}/>
    <ListItemLink to={'/bootstrap'} primary="Bootstrap" icon={<ShoppingCartIcon/>}/>
    <ListItemLink to={'/pulse'} primary="Pulse" icon={<PeopleIcon/>}/>
    <ListItemLink to={'/ant'} primary="Ant" icon={<BarChartIcon/>}/>
    <ListItemLink to={'https://bemit.codes'} primary="Documentation" icon={<LayersIcon/>} normalLink/>
</div>);

export const secondaryListItems = (
    <div>
        <h6>Example Schemas</h6>
        <li>
            <button className={['list-group-item', 'list-group-item-action', 'text-primary'].join(' ')}>
                <ListItemIcon>
                    <AssignmentIcon/>
                </ListItemIcon>
                User
            </button>
        </li>
        <li>
            <button className={['list-group-item', 'list-group-item-action', 'text-primary'].join(' ')}>
                <ListItemIcon>
                    <AssignmentIcon/>
                </ListItemIcon>
                Product
            </button>
        </li>
        <li>
            <button className={['list-group-item', 'list-group-item-action', 'text-primary'].join(' ')}>
                <ListItemIcon>
                    <AssignmentIcon/>
                </ListItemIcon>
                Survey
            </button>
        </li>
    </div>
);
