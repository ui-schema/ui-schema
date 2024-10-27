import React from 'react';
import clsx from "clsx";

export default function NavBar() {
    return <div className={clsx("row", "navbar", "fixed-top", "px-5", "py-2", "bg-primary", "text-light")} style={{height: "70px"}}/>;
}


