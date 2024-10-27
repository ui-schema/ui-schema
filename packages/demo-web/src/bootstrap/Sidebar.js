import React from 'react';
import clsx from 'clsx';
import {NavLink as Link} from 'react-router-dom';
import {routesThemes} from '../routes';

export default function Sidebar() {
    return <ul className={clsx('col-xs-12', 'col-sm-3', 'py-5', 'bg-light', 'mh-100', 'overflow-auto', 'list-group', 'list-group-flush')} style={{minHeight: '100% !important'}}>
        {routesThemes.map(route =>
            <li key={route[0]} className={clsx('list-group-item', 'bg-light', 'text-dark', 'list-group-item-action', 'text-center', 'font-weight-bold')}>
                <Link to={route[0]}>{route[1]}</Link>
            </li>)}
    </ul>
}
