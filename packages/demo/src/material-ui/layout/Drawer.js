import clsx from "clsx";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import Drawer from "@material-ui/core/Drawer";
import React from "react";

import {mainListItems, secondaryListItems} from "../dashboard/listItems";

const AppDrawer = (props) => {
    const {classes, open} = props;

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
};

export {AppDrawer}
