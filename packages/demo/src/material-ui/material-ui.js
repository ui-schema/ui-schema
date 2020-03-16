import React from 'react';
import AppTheme from './layout/AppTheme';
import Dashboard from './dashboard/Dashboard';
import {schemaWCombining} from "../schemas/demoCombining";
import {schemaWConditional, schemaWConditional1, schemaWConditional2} from "../schemas/demoConditional";
import {schemaWDep, schemaWDep1, schemaWDep2} from "../schemas/demoDependencies";
import {dataDemoMain, schemaDemoMain, schemaUser} from "../schemas/demoMain";
import {schemaSimString, schemaSimBoolean, schemaSimCheck, schemaSimNumber, schemaSimRadio, schemaSimSelect} from "../schemas/demoSimples";
import {schemaGrid} from "../schemas/demoGrid";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {Button} from "@material-ui/core";
import {widgets,} from "@ui-schema/ds-material";
import {SchemaEditor, isInvalid, createOrderedMap, createMap, createStore, createEmptyStore} from "@ui-schema/ui-schema";
import {MuiSchemaDebug} from "./component/MuiSchemaDebug";
import {browserT} from "../t";
import {schemaLists} from "../schemas/demoLists";
import {schemaNumberSlider} from "../schemas/demoNumberSlider";
import {createDummyRenderer} from "./component/MuiMainDummy";
import {useDummy} from "../component/MainDummy";

const DummyRenderer = createDummyRenderer(widgets);

const MainStore = () => {
    const [showValidity, setShowValidity] = React.useState(false);
    const [store, setStore] = React.useState(() => createStore(createMap(dataDemoMain)));
    const [schema, setSchema] = React.useState(() => createOrderedMap(schemaDemoMain));

    return <React.Fragment>
        <SchemaEditor
            schema={schema}
            store={store}
            onChange={setStore}
            widgets={widgets}
            showValidity={showValidity}
            t={browserT}
        >
            <MuiSchemaDebug setSchema={setSchema}/>
        </SchemaEditor>

        <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
        {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}

    </React.Fragment>
};

const DemoUser = () => {
    const [store, setStore] = React.useState(() => createEmptyStore());

    return <Grid container spacing={3} justify={'center'}>
        <Grid item xs={12} md={6}>
            <SchemaEditor
                schema={schemaUser}
                store={store}
                onChange={setStore}
                widgets={widgets}
                t={browserT}
            >
                <MuiSchemaDebug/>
            </SchemaEditor>
        </Grid>
    </Grid>
};

const Main = ({classes = {}}) => {
    const {toggleDummy, getDummy} = useDummy();

    return <React.Fragment>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaWConditional1'} schema={schemaWConditional2} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                <MainStore/>
            </Paper>
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaNumberSlider'} schema={schemaNumberSlider} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaLists'} schema={schemaLists} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaWCombining'} schema={schemaWCombining} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaWConditional'} schema={schemaWConditional} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaWConditional1'} schema={schemaWConditional1} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaWDep'} schema={schemaWDep} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaWDep1'} schema={schemaWDep1} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaWDep2'} schema={schemaWDep2} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaGrid'} schema={schemaGrid(12)} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaSimString'} schema={schemaSimString} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
            <DummyRenderer id={'schemaSimBoolean'} schema={schemaSimBoolean} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
            <DummyRenderer id={'schemaSimCheck'} schema={schemaSimCheck} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
            <DummyRenderer id={'schemaSimNumber'} schema={schemaSimNumber} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
            <DummyRenderer id={'schemaSimRadio'} schema={schemaSimRadio} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
            <DummyRenderer id={'schemaSimSelect'} schema={schemaSimSelect} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
        <Grid item xs={12}>
            <Button style={{marginBottom: 12}} onClick={() => toggleDummy('demoUser')} variant={getDummy('demoUser') ? 'contained' : 'outlined'}>
                demo User
            </Button>
            {getDummy('demoUser') ? <Paper className={classes.paper}>
                <DemoUser/>
            </Paper> : null}
        </Grid>
    </React.Fragment>
};

export default () => <AppTheme>
    <Dashboard main={Main}/>
</AppTheme>;
