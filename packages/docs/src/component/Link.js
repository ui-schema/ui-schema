import React from 'react';
import clsx from 'clsx';
import {
    NavLink as RouterLink
} from "react-router-dom";
import MuiLink from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIc from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from "@material-ui/core/styles/makeStyles";

const useListItemStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.type === 'dark' ? theme.palette.primary.main : 'inherit',
    },
}));

const useListLinkStyles = makeStyles(theme => ({
    root: {
        '&.active': {
            background: theme.palette.divider
        }
    },
}));

const ListItemIcon = props => {
    const classes = useListItemStyles();
    return <ListItemIc classes={classes} {...props}/>;
};

function ListItemLink({icon, primary, to, dense, style, onClick, classes = {}, showActive, children}) {
    const classesLink = useListLinkStyles();

    const renderLink = React.useMemo(() => React.forwardRef((itemProps, ref) =>
        <RouterLink to={to} exact ref={ref} {...itemProps} />
    ), [to],);

    return <ListItem
        button component={renderLink} style={style} dense={dense}
        onClick={onClick}
        className={clsx(classes.listItem ? classes.listItem : undefined, showActive ? classesLink.root : undefined)}
    >
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} className={classes.listItemText ? classes.listItemText : undefined}/>
        {children}
    </ListItem>;
}

const LinkList = ({children}) => {
    return <List component="nav" aria-label="main mailbox folders">{children}</List>
};

const Link = ({primary, ...props}) => <MuiLink component={RouterLink} {...props} children={primary}/>;

export {ListItemIcon, LinkList, ListItemLink, Link}
