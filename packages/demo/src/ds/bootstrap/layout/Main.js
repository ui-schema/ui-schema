import React from "react";
import styles from 'bootstrap/dist/css/bootstrap.css';
import clsx from "clsx";
import Sidebar from "./Sidebar";
import NavBar from "./NavBar";
import Copyright from "./Copyright";


const BootstrapStyle = () => {
    React.useEffect(() => {
        styles.use();

        return () => styles.unuse();
    }, []);

    return null;
};

const BootstrapDashboard = ({children}) => {
    return <React.Fragment>
        <BootstrapStyle/>
        <div className={clsx("container-fluid", "text-light")} >
            <NavBar/>
            <div className={clsx("row", "h-100")} style={{marginTop: "70px", height: "100% !important"}}>
                <Sidebar/>
                <div className={clsx("col-xs-12", "col-sm-9", "px-5", "overflow-auto", "bg-secondary")} style={{height: "100% !important"}}>
                    <div className={clsx("row", "justify-content-center")}>
                        <div className={clsx("col-md-10", "py-5", "bg-secondary")}>
                            <div className={clsx("row", "shadow-sm", "px-5", "py-5", "bg-info", "rounded")}>
                                <h1>Bootstrap!</h1>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
                <Copyright/>
            </div>
        </div>
    </React.Fragment>
};

export {BootstrapDashboard}
