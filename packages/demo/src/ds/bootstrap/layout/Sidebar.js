import React from "react";
import clsx from "clsx";
import {Link} from 'react-router-dom';


export default function Sidebar() {

    return <React.Fragment>
        <ul className={clsx("col-xs-12", "col-sm-3", "py-5", "bg-info", "mh-100", "overflow-auto", "list-group", "list-group-flush")} style={{minHeight: "100% !important"}}>
            <li className={clsx("list-group-item", "bg-info", "text-dark", "list-group-item-action", "text-center", "font-weight-bold")}>
                <Link to={'/'}>Material</Link>
            </li>
            <li className={clsx("list-group-item", "bg-info", "text-dark", "list-group-item-action", "text-center", "font-weight-bold")}>
                <Link to={'/bootstrap'}>Bootstrap</Link>
            </li>
            <li className={clsx("list-group-item", "bg-info", "text-dark", "list-group-item-action", "text-center", "font-weight-bold")}>Pulse</li>
            <li className={clsx("list-group-item", "bg-info", "text-dark", "list-group-item-action", "text-center", "font-weight-bold")}>Ant</li>
        </ul>
    </React.Fragment>;
}

