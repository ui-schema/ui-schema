import React from 'react';
import AppTheme from './layout/AppTheme';
import Dashboard from './dashboard/Dashboard';
import Grid from "@material-ui/core/Grid";
import {widgets,} from "@ui-schema/ds-material";
import {createDummyRenderer} from "./component/MuiMainDummy";
import {useDummy} from "../component/MainDummy";
import {
    Color, ColorDialog,
    ColorSwatches,
    ColorCircle, ColorCompact, ColorMaterial,
    ColorBlock, ColorTwitter, ColorSlider,
    ColorAlpha, ColorHue, ColorSketch,
    ColorSliderStatic, ColorStatic,
    ColorCircleStatic, ColorTwitterStatic,
    ColorSketchStatic, ColorSketchDialog,
} from "@ui-schema/material-color";
import {schemaColor} from "../schemas/demoColor";

const customWidgets = {...widgets};
customWidgets.custom = {
    ...widgets.custom,
    Color,
    ColorDialog,
    ColorStatic,
    ColorSwatches,
    ColorCircle,
    ColorCompact,
    ColorMaterial,
    ColorTwitter,
    ColorBlock,
    ColorSlider,
    ColorAlpha,
    ColorHue,
    ColorSketch,
    ColorSliderStatic,
    ColorCircleStatic,
    ColorTwitterStatic,
    ColorSketchStatic,
    ColorSketchDialog,
};

const DummyRenderer = createDummyRenderer(customWidgets);

const Main = ({classes = {}}) => {
    const {toggleDummy, getDummy} = useDummy();

    return <Grid item xs={12}>
        <DummyRenderer id={'schemaColor'} open schema={schemaColor} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
    </Grid>
};

export default () => (
    <AppTheme>
        <Dashboard main={Main}/>
    </AppTheme>
)
