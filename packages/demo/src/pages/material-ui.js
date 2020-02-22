import React from 'react';
import {List} from 'immutable';
import AppTheme from '../ds/material-ui/layout/AppTheme';
import Dashboard from '../ds/material-ui/dashboard/Dashboard';
import {schemaWCombining} from "../schemas/demoCombining";
import {schemaWConditional, schemaWConditional1} from "../schemas/demoConditional";
import {schemaWDep, schemaWDep1, schemaWDep2} from "../schemas/demoDependencies";
import {dataDemoMain, schemaDemoMain, schemaUser} from "../schemas/demoMain";
import {schemaSimString, schemaSimBoolean, schemaSimCheck, schemaSimNumber, schemaSimRadio, schemaSimSelect} from "../schemas/demoSimples";
import {schemaGrid} from "../schemas/demoGrid";
import {useTheme} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {Button} from "@material-ui/core";
import Orders from "../ds/material-ui/dashboard/Orders";
import {widgets,} from "@ui-schema/ds-material";
import {SchemaEditor, isInvalid, createOrderedMap, createMap} from "@ui-schema/ui-schema";
import {MuiSchemaDebug} from "../component/MuiSchemaDebug";
import {Map} from 'immutable';
import {browserT} from "../t";

const MainStore = () => {
    const [showValidity, setShowValidity] = React.useState(false);
    const [validity, setValidity] = React.useState(createMap());
    const [data, setData] = React.useState(createOrderedMap(dataDemoMain));
    const [schema, setSchema] = React.useState(createOrderedMap(schemaDemoMain));

    return <React.Fragment>
        <SchemaEditor
            schema={schema}
            store={data}
            onChange={setData}
            widgets={widgets}
            validity={validity}
            showValidity={showValidity}
            onValidity={setValidity}
            t={browserT}
        >
            <MuiSchemaDebug setSchema={setSchema}/>
        </SchemaEditor>

        <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
        {isInvalid(validity) ? 'invalid' : 'valid'}

    </React.Fragment>
};

const defaultCreate = type => {
    return type === 'array' ?
        List([]) :
        type === 'string' ?
            '' :
            type === 'number' ?
                0 :
                type === 'boolean' ?
                    false :
                    Map({})
};

const MainDummy = ({schema}) => {
    const [showValidity, setShowValidity] = React.useState(false);
    const [validity, setValidity] = React.useState(Map({}));
    const [data, setData] = React.useState(() => defaultCreate(schema.get('type')));

    return <React.Fragment>
        <SchemaEditor
            schema={schema}
            store={data}
            onChange={setData}
            widgets={widgets}
            validity={validity}
            showValidity={showValidity}
            onValidity={setValidity}
            t={browserT}
        >
            <MuiSchemaDebug/>
        </SchemaEditor>
        <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
        {isInvalid(validity) ? 'invalid' : 'valid'}
    </React.Fragment>
};

const DemoUser = () => {
    const [data, setData] = React.useState(createOrderedMap({}));

    return <Grid container spacing={3} justify={'center'}>
        <Grid item xs={12} md={6}>
            <SchemaEditor
                schema={schemaUser}
                store={data}
                onChange={setData}
                widgets={widgets}
                t={browserT}
            >
                <MuiSchemaDebug/>
            </SchemaEditor>
        </Grid>
    </Grid>
};

const DummyRenderer = ({id, schema, toggleDummy, getDummy, open, classes}) => <React.Fragment>
    {open ? null : <Button style={{marginBottom: 12}} onClick={() => toggleDummy(id)} variant={getDummy(id) ? 'contained' : 'outlined'}>
        {id.replace(/([A-Z0-9])/g, ' $1').replace(/^./, str => str.toUpperCase())}
    </Button>}
    {getDummy(id) || open ? <Paper className={classes.paper}>
        <MainDummy schema={schema}/>
    </Paper> : null}
</React.Fragment>;


const Main = ({classes = {}}) => {
    const [showDummy, setShowVDummy] = React.useState({});
    const theme = useTheme();

    const toggleDummy = id => {
        let tmp = {...showDummy};
        tmp[id] = !tmp[id];
        setShowVDummy(tmp);
    };
    const getDummy = id => {
        return !!showDummy[id];
    };

    return <React.Fragment>
        <Grid item xs={12} className={'t-' + theme.palette.type}>
            <Paper className={classes.paper}>
                <MainStore/>
            </Paper>
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
            <DummyRenderer id={'schemaGrid'} schema={schemaGrid} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
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