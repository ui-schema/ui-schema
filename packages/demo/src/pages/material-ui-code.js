import React from 'react';
import AppTheme from '../ds/material-ui/layout/AppTheme';
import Dashboard from '../ds/material-ui/dashboard/Dashboard';
import Grid from "@material-ui/core/Grid";
import {widgets,} from "@ui-schema/ds-material";
import {createDummyRenderer} from "../component/MuiMainDummy";
import {useDummy} from "../component/MainDummy";
import {schemaCode} from "../schemas/demoSimples";
import {Code} from "@ui-schema/material-code";
import "codemirror/mode/css/css";
import "codemirror/mode/javascript/javascript";

const customWidgets = {...widgets};
customWidgets.custom = {
    ...widgets.custom,
    Code,
};

const DummyRenderer = createDummyRenderer(customWidgets);

const Main = ({classes = {}}) => {
    const {toggleDummy, getDummy} = useDummy();

    return <React.Fragment>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaCode'} open schema={schemaCode} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
    </React.Fragment>
};

export default () => <AppTheme>
    <Dashboard main={Main}/>
</AppTheme>
