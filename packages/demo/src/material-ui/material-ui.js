import React from 'react';
import AppTheme from './layout/AppTheme';
import Dashboard from './dashboard/Dashboard';
import {schemaWCombining} from '../schemas/demoCombining';
import {schemaWConditional, schemaWConditional1, schemaWConditional2} from '../schemas/demoConditional';
import {schemaWDep1, schemaWDep2} from '../schemas/demoDependencies';
import {dataDemoMain, schemaDemoMain, schemaUser} from '../schemas/demoMain';
import {schemaDemoReferencing, schemaDemoReferencingNetwork, schemaDemoReferencingNetworkB} from '../schemas/demoReferencing';
import {schemaSimString, schemaSimBoolean, schemaSimCheck, schemaSimNumber, schemaSimRadio, schemaSimSelect, schemaNull, schemaSimInteger} from '../schemas/demoSimples';
import {schemaGrid} from '../schemas/demoGrid';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Button} from '@material-ui/core';
import {Step, Stepper, widgets} from '@ui-schema/ds-material';
import {UIGenerator, isInvalid, createOrderedMap, createMap, createStore, createEmptyStore} from '@ui-schema/ui-schema';
import {MuiSchemaDebug} from './component/MuiSchemaDebug';
import {browserT} from '../t';
import {schemaLists} from '../schemas/demoLists';
import {schemaNumberSlider} from '../schemas/demoNumberSlider';
import {createDummyRenderer} from './component/MuiMainDummy';
import {useDummy} from '../component/MainDummy';
import {UIApiProvider} from '@ui-schema/ui-schema/UIApi/UIApi';
import {ReferencingNetworkHandler} from '@ui-schema/ui-schema/Plugins/ReferencingHandler';
import {storeUpdater} from '@ui-schema/ui-schema/UIStore/storeUpdater';
import {schemaDemoTable, schemaDemoTableAdvanced, schemaDemoTableMap, schemaDemoTableMapBig} from '../schemas/demoTable';
import {Table} from '@ui-schema/ds-material/Widgets/Table';
import {NumberRendererCell, StringRendererCell, TextRendererCell} from '@ui-schema/ds-material/Widgets/TextFieldCell';
import {TableAdvanced} from '@ui-schema/ds-material/Widgets/TableAdvanced/TableAdvanced';
import {List, OrderedMap} from 'immutable';
import {UIProvider} from '@ui-schema/ui-schema/UIGenerator/UIGenerator';
import {PluginStack} from '@ui-schema/ui-schema/PluginStack/PluginStack';
import {applyPluginStack} from '@ui-schema/ui-schema/applyPluginStack';
import {StringRenderer} from '@ui-schema/ds-material/Widgets/TextField';

const customWidgets = {...widgets}
const pluginStack = [...customWidgets.pluginStack]
// the referencing network handler should be at first position
// must be before the `ReferencingHandler`, thus if the root schema for the level is a network schema,
// the network handler can download it, and the normal referencing handler may handle references inside of e.g. `if`
// maybe the network handlers adds a generic prop `resolveNetworkRef`, to request network schema inside e.g. an `if` from inside the ReferencingHandler
pluginStack.splice(0, 0, ReferencingNetworkHandler)
customWidgets.pluginStack = pluginStack

const CustomTable = ({widgets, ...props}) => {
    const customWidgets = React.useMemo(() => ({
        ...widgets,
        types: {
            ...widgets.types,
            string: StringRendererCell,
            number: NumberRendererCell,
            integer: NumberRendererCell,
        },
        custom: {
            ...widgets.custom,
            Text: TextRendererCell,
        },
    }), [widgets])

    return <Table
        {...props}
        widgets={customWidgets}
    />
}

customWidgets.custom.Table = CustomTable
customWidgets.custom.TableAdvanced = TableAdvanced
customWidgets.custom.Stepper = Stepper
customWidgets.custom.Step = Step

//widgets.types.null = () => 'null'

const DummyRenderer = createDummyRenderer(customWidgets);

const MainStore = () => {
    const [showValidity, setShowValidity] = React.useState(false);
    const [store, setStore] = React.useState(() => createStore(createMap(dataDemoMain)));
    const [schema, setSchema] = React.useState(() => createOrderedMap(schemaDemoMain));

    const onChangeNext = React.useCallback((storeKeys, scopes, updater, deleteOnEmpty, type) => {
        setStore(prevStore => {
            const newStore = storeUpdater(storeKeys, scopes, updater, deleteOnEmpty, type)(prevStore)
            /*const newValue = newStore.getIn(prependKey(storeKeys, 'values'))
            const prevValue = prevStore.getIn(prependKey(storeKeys, 'values'))
            console.log(
                isImmutable(newValue) ? newValue.toJS() : newValue,
                isImmutable(prevValue) ? prevValue.toJS() : prevValue,
                storeKeys.toJS(),
                deleteOnEmpty, type,
            )*/
            return newStore
        })
    }, [setStore])

    return <React.Fragment>
        <UIGenerator
            schema={schema}
            store={store}
            onChange={onChangeNext}
            widgets={customWidgets}
            showValidity={showValidity}
            t={browserT}
        >
            <MuiSchemaDebug setSchema={setSchema}/>
        </UIGenerator>

        <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
        {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}

    </React.Fragment>
};

const DemoUser = () => {
    const [store, setStore] = React.useState(() => createEmptyStore());

    const onChangeNext = React.useCallback((storeKeys, scopes, updater, deleteOnEmpty, type) => {
        setStore(storeUpdater(storeKeys, scopes, updater, deleteOnEmpty, type))
    }, [setStore])

    return <Grid container spacing={3} justify={'center'}>
        <Grid item xs={12} md={6}>
            <UIGenerator
                schema={schemaUser}
                store={store}
                onChange={onChangeNext}
                widgets={customWidgets}
                t={browserT}
            >
                <MuiSchemaDebug/>
            </UIGenerator>
        </Grid>
    </Grid>
};

const loadSchema = (url, versions) => {
    console.log('Demo loadSchema (url, optional versions)', url, versions)
    return fetch(url).then(r => r.json())
}

const Main = ({classes = {}}) => {
    const {toggleDummy, getDummy} = useDummy();

    return <React.Fragment>
        <Grid item xs={12}>
            <DummyRenderer
                id={'schemaTableMap'} schema={schemaDemoTableMap}
                open
                toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}
                stylePaper={{background: 'transparent'}} variant={'outlined'}
            />
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer
                id={'schemaTable'} schema={schemaDemoTable}
                open
                toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}
                stylePaper={{background: 'transparent'}} variant={'outlined'}
            />
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer
                id={'schemaDemoTableMapBig'} schema={schemaDemoTableMapBig}
                open
                toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}
                stylePaper={{background: 'transparent'}} variant={'outlined'}
            />
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer
                id={'schemaDemoTableAdvanced'} schema={schemaDemoTableAdvanced}
                open
                toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}
                stylePaper={{background: 'transparent'}} variant={'outlined'}
            />
        </Grid>
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                <MainStore/>
            </Paper>
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer
                id={'schemaReferencingNetwork'} schema={schemaDemoReferencingNetwork}
                toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}
                stylePaper={{background: 'transparent'}} variant={'outlined'}
            />
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer
                id={'schemaReferencingNetworkB'} schema={schemaDemoReferencingNetworkB}
                toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}
                stylePaper={{background: 'transparent'}} variant={'outlined'}
            />
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaReferencing'} schema={schemaDemoReferencing} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes} stylePaper={{background: 'transparent'}} variant={'outlined'}/>
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaNumberSlider'} schema={schemaNumberSlider} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaLists'} schema={schemaLists} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes} open/>
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
            <DummyRenderer id={'schemaWConditional2'} schema={schemaWConditional2} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
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
            <DummyRenderer id={'schemaSimInteger'} schema={schemaSimInteger} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
            <DummyRenderer id={'schemaSimRadio'} schema={schemaSimRadio} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
            <DummyRenderer id={'schemaSimSelect'} schema={schemaSimSelect} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaNull'} schema={schemaNull} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes} stylePaper={{background: 'transparent'}} variant={'outlined'}/>
        </Grid>
        <Grid item xs={12}>
            <Button style={{marginBottom: 12}} onClick={() => toggleDummy('freeFormEditor')} variant={getDummy('freeFormEditor') ? 'contained' : 'outlined'}>
                FreeFormEditor
            </Button>
            {getDummy('freeFormEditor') ? <Paper className={classes.paper}>
                <Typography component={'p'} variant={'body1'}>
                    One root schema, but rendering the widgets fully manually in the root level, without validating the root object for this strategy, technical limitation.
                </Typography>
                <FreeFormEditor/>
            </Paper> : null}
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

const freeFormSchema = createOrderedMap({
    type: 'object',
    name: {
        type: 'string',
    },
    city: {
        type: 'string',
        widget: 'Select',
        enum: ['Berlin', 'Paris', 'Zurich'],
    },
})

const storeKeys = List()

const WidgetTextField = applyPluginStack(StringRenderer)

const FreeFormEditor = () => {
    const [showValidity, setShowValidity] = React.useState(false);
    const [store, setStore] = React.useState(() => createStore(OrderedMap()))

    const onChange = React.useCallback((storeKeys, scopes, updater, deleteOnEmpty, type) => {
        setStore(storeUpdater(storeKeys, scopes, updater, deleteOnEmpty, type))
    }, [setStore])

    return <React.Fragment>
        <UIProvider
            store={store}
            onChange={onChange}
            widgets={customWidgets}
            showValidity={showValidity}
            t={browserT}
            schema={freeFormSchema}
        >
            <Grid container dir={'columns'} spacing={4}>
                <WidgetTextField
                    level={1}
                    storeKeys={storeKeys.push('name')}
                    schema={freeFormSchema.get('name')}
                    parentSchema={freeFormSchema}

                    // using `applyPluginStack`, this free-form widget is fully typed
                    // with the actual props of the widget component
                    multiline={false}
                />
                <PluginStack
                    showValidity={showValidity}
                    storeKeys={storeKeys.push('city')}
                    schema={freeFormSchema.get('city')}
                    parentSchema={freeFormSchema}
                    level={1}
                    readOnly={false}
                    // noGrid={false} (as grid-item is included in `PluginStack`)
                />
            </Grid>

            <MuiSchemaDebug setSchema={() => null}/>
        </UIProvider>

        <div style={{width: '100%'}}>
            <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
            <div>
                {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}
            </div>
        </div>
    </React.Fragment>
};

export default () => <AppTheme>
    <UIApiProvider loadSchema={loadSchema} noCache>
        <Dashboard main={Main}/>
    </UIApiProvider>
</AppTheme>;
