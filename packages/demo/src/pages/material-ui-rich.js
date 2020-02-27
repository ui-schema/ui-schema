import React from 'react';
import AppTheme from '../ds/material-ui/layout/AppTheme';
import Dashboard from '../ds/material-ui/dashboard/Dashboard';
import Grid from "@material-ui/core/Grid";
import {widgets,} from "@ui-schema/ds-material";
import {RichText, RichTextInline} from "@ui-schema/material-richtext";
import {createDummyRenderer} from "../component/MuiMainDummy";
import {useDummy} from "../component/MainDummy";
import {schemaRichText} from "../schemas/demoRichText";

const customWidgets = {...widgets};
customWidgets.custom = {
    ...widgets.custom,
    RichText: RichText,
    RichTextInline: RichTextInline,
};

const DummyRenderer = createDummyRenderer(customWidgets);

const Main = ({classes = {}}) => {
    const {toggleDummy, getDummy} = useDummy();

    return <React.Fragment>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaRichText'} open schema={schemaRichText} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
    </React.Fragment>
};

export default () => <AppTheme>
    <Dashboard main={Main}/>
</AppTheme>

export {customWidgets}
