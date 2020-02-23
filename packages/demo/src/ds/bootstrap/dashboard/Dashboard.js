import React from 'react';

import {BootstrapDashboard} from "../layout/Main";


export default function Dashboard(props) {

    return (
        <div>
            <BootstrapDashboard main={props.main}/>
        </div>
    );
}
