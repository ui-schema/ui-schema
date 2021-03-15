import React from 'react';
import AppTheme from './layout/AppTheme';
import Dashboard from './dashboard/Dashboard';
import Grid from '@material-ui/core/Grid';
import {widgets} from '@ui-schema/ds-material';
import {RichContent, RichContentInline} from '@ui-schema/material-slate';
import {createDummyRenderer} from './component/MuiMainDummy';
import {useDummy} from '../component/MainDummy';
import {schemaDemoSlate} from '../schemas/demoSlate';

const customWidgets = {...widgets};
customWidgets.custom = {
    ...widgets.custom,
    RichContent: RichContent,
    RichContentInline: RichContentInline,
};

const DummyRenderer = createDummyRenderer(customWidgets);

const Main = ({classes = {}}) => {
    const {toggleDummy, getDummy} = useDummy();

    return <React.Fragment>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaSlate'} open schema={schemaDemoSlate} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
    </React.Fragment>
};

export default () => <AppTheme>
    <Dashboard main={Main}/>
</AppTheme>

export {customWidgets}
