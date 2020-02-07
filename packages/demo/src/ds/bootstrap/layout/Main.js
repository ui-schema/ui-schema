import React from "react";

import 'bootstrap/dist/css/bootstrap.css';

const BootstrapDashboard = ({children}) => {
    return <React.Fragment>
        <h1>Bootstrap!</h1>
        {children}
    </React.Fragment>
};

export {BootstrapDashboard}
