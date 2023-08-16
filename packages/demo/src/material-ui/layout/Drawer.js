import clsx from "clsx";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Drawer from "@mui/material/Drawer";
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

    </Drawer>
};

export {AppDrawer}
