import React from 'react';
import AppTheme from '../ds/material-ui/layout/AppTheme';
import Dashboard from '../ds/material-ui/dashboard/Dashboard';

import {data1, schema1, schemaUser} from "../_schema1";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {Button} from "@material-ui/core";
import Orders from "../ds/material-ui/dashboard/Orders";
import {widgets,} from "@ui-schema/ds-material";
import {SchemaEditor, isInvalid} from "@ui-schema/ui-schema";
import {SchemaDebug} from "../component/SchemaDebug";
import {Map} from 'immutable';

const user = {};

const MainStore = () => {
    const [showValidity, setShowValidity] = React.useState(false);
    const [validity, setValidity] = React.useState(Map({}));

    return <React.Fragment>
        <SchemaEditor
            schema={schema1}
            data={data1}
            widgets={widgets}
            validity={validity}
            showValidity={showValidity}
            onValidity={setValidity}
        >
            <SchemaDebug/>
        </SchemaEditor>
        <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
        {isInvalid(validity) ? 'invalid' : 'valid'}
    </React.Fragment>
};

const Main = ({classes = {}}) => <React.Fragment>
    <Grid item xs={12}>
        <Paper className={classes.paper}>
            <MainStore/>
        </Paper>
    </Grid>
    <Grid item xs={12}>
        <Paper className={classes.paper}>
            <Grid container spacing={3} justify={'center'}>
                <Grid item xs={12} md={6}>
                    <SchemaEditor
                        schema={schemaUser}
                        data={user}
                        widgets={widgets}
                    >
                        <SchemaDebug/>
                    </SchemaEditor>
                </Grid>
            </Grid>
        </Paper>
    </Grid>
    <Grid item xs={12}>
        <Paper className={classes.paper}>
            <Orders/>
        </Paper>
    </Grid>
</React.Fragment>;

const MaterialUi = () => {
    return <AppTheme>
        <Dashboard main={Main}/>
    </AppTheme>
};

export {MaterialUi}
