import React from 'react';
import AppTheme from '../ds/material-ui/layout/AppTheme';
import Dashboard from '../ds/material-ui/dashboard/Dashboard';

import {data1, schema1, schemaUser} from "../_schema1";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Orders from "../ds/material-ui/dashboard/Orders";
import {widgets} from "@ui-schema/ds-material/src";
import {SchemaEditor} from "@ui-schema/ui-schema/src";
import {SchemaDebug} from "../component/SchemaDebug";

const user = {};

const Main = ({classes = {}}) => {
    return <React.Fragment>
        {/* Recent Orders */}
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                <SchemaEditor
                    schema={schema1}
                    data={data1}
                    widgets={widgets}
                >
                    <SchemaDebug/>
                </SchemaEditor>
            </Paper>
        </Grid>
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                <Grid container spacing={3} justify={'center'}>
                    {/* Recent Orders */}
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
        {/* Recent Orders */}
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                <Orders/>
            </Paper>
        </Grid>
    </React.Fragment>
};
const MaterialUi = () => {
    return <AppTheme>
        <Dashboard main={Main}/>
    </AppTheme>
};

export {MaterialUi}
