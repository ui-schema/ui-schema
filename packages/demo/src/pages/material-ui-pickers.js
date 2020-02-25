import React from 'react';
import AppTheme from '../ds/material-ui/layout/AppTheme';
import Dashboard from '../ds/material-ui/dashboard/Dashboard';
import Grid from "@material-ui/core/Grid";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import {widgets,} from "@ui-schema/ds-material";
import {TimePicker, DatePicker, DateTimePicker} from "@ui-schema/material-pickers";
import {createDummyRenderer} from "../component/MuiMainDummy";
import {schemaDatePickers} from "../schemas/demoDatePickers";
import {useDummy} from "../component/MainDummy";
import LuxonAdapter from "@date-io/luxon";

const customWidgets = {...widgets};
customWidgets.custom = {
    ...widgets.custom,
    DateTime: DateTimePicker,
    Date: DatePicker,
    Time: TimePicker,
};

const DummyRenderer = createDummyRenderer(customWidgets);

const Main = ({classes = {}}) => {
    const {toggleDummy, getDummy} = useDummy();

    return <React.Fragment>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaDateTimePickers'} open schema={schemaDatePickers} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
    </React.Fragment>
};

export default () => <AppTheme>
    <MuiPickersUtilsProvider utils={LuxonAdapter}>
        <Dashboard main={Main}/>
    </MuiPickersUtilsProvider>
</AppTheme>
