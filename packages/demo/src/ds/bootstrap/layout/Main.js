import React from "react";
import 'bootstrap/dist/css/bootstrap.css';

const BootstrapStyle = (styles) => {
    React.useEffect(() => {
        styles.use();

        return () => styles.unuse();
    }, []);

    return null;
};

const BootstrapDashboard = ({children}) => {
    return <React.Fragment>
       /* <BootstrapStyle/>  */

        <h1>Bootstrap!</h1>
        {children}
    </React.Fragment>
};

export {BootstrapDashboard}
