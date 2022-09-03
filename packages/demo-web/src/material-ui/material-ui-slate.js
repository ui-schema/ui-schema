import React from 'react';
import AppTheme from './layout/AppTheme';
import Dashboard from './layout/Dashboard';
import Grid from '@mui/material/Grid';
import {getWidgets} from '@ui-schema/ds-material/WidgetsBinding';
import {RichContent, RichContentInline} from '@ui-schema/material-slate';
import {schemaDemoSlate, schemaDemoSlateSingle} from '../schemas/demoSlate';
import {RichContentPane} from '@ui-schema/material-slate/Widgets/RichContentPane';
import {browserT} from '../t';
import {UIMetaProvider} from '@ui-schema/react/UIMeta';
import {DummyRenderer} from './component/MuiMainDummy';

const customWidgets = getWidgets();
customWidgets.custom = {
    ...widgets.custom,
    RichContentPane: RichContentPane,
    RichContent: RichContent,
    RichContentInline: RichContentInline,
};

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
    <UIMetaProvider widgets={customWidgets} t={browserT}>
        <Dashboard main={Main}/>
    </UIMetaProvider>
</AppTheme>

export {customWidgets}
