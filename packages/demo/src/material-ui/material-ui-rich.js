import React from 'react';
import AppTheme from './layout/AppTheme';
import Dashboard from './dashboard/Dashboard';
import Grid from '@material-ui/core/Grid';
import {widgets} from '@ui-schema/ds-material';
import {RichText, RichTextInline} from '@ui-schema/material-richtext';
import {DummyRenderer} from './component/MuiMainDummy';
import {useDummy} from '../component/MainDummy';
import {schemaRichText} from '../schemas/demoRichText';
import {browserT} from '../t';
import {UIMetaProvider} from '@ui-schema/ui-schema';

const customWidgets = {...widgets};
customWidgets.custom = {
    ...widgets.custom,
    RichText: RichText,
    RichTextInline: RichTextInline,
};

const Main = ({classes = {}}) => {
    const {toggleDummy, getDummy} = useDummy();

    return <React.Fragment>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaRichText'} open schema={schemaRichText} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
    </React.Fragment>
};

export default () => <AppTheme>
    <UIMetaProvider widgets={customWidgets} t={browserT}>
        <Dashboard main={Main}/>
    </UIMetaProvider>
</AppTheme>

export {customWidgets}
