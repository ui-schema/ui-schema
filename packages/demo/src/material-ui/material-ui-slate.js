import React from 'react';
import AppTheme from './layout/AppTheme';
import Dashboard from './dashboard/Dashboard';
import Grid from '@material-ui/core/Grid';
import {widgets} from '@ui-schema/ds-material';
import {RichContent, RichContentInline} from '@ui-schema/material-slate';
import {createDummyRenderer} from './component/MuiMainDummy';
import {schemaDemoSlate, schemaDemoSlateSingle} from '../schemas/demoSlate';
import {RichContentPane} from '@ui-schema/material-slate/Widgets/RichContentPane';

const customWidgets = {...widgets};
customWidgets.custom = {
    ...widgets.custom,
    RichContentPane: RichContentPane,
    RichContent: RichContent,
    RichContentInline: RichContentInline,
};

const DummyRenderer = createDummyRenderer(customWidgets);

const Main = ({classes = {}}) => {
    return <React.Fragment>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaSlate'} open schema={schemaDemoSlateSingle} classes={classes}/>
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaSlate'} open schema={schemaDemoSlate} classes={classes}/>
        </Grid>
    </React.Fragment>
};

export default () => <AppTheme>
    <Dashboard main={Main}/>
</AppTheme>

export {customWidgets}
