import React from 'react'
import AppTheme from './layout/AppTheme'
import Dashboard from './dashboard/Dashboard'
import Grid, { GridSpacing } from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { MuiWidgetBinding, widgets } from '@ui-schema/ds-material'
import {
    createOrderedMap, createStore,
    GroupRendererProps,
    UIMetaProvider, UIStoreProvider,
    useUIMeta, WidgetType,
    UIStoreActions, UIStoreType,
} from '@ui-schema/ui-schema'
import { browserT } from '../t'
import { storeUpdater } from '@ui-schema/ui-schema/storeUpdater'
import { OrderedMap } from 'immutable'
import { UIRootRenderer } from '@ui-schema/ui-schema/UIRootRenderer/UIRootRenderer'
import { MuiSchemaDebug } from './component/MuiSchemaDebug'
import { UIMetaReadContextType } from '@ui-schema/ui-schema/UIMetaReadContext'
import { NumberRendererRead, StringRendererRead, TextRendererRead, WidgetSelectRead } from '@ui-schema/ds-material/WidgetsRead'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'

const GroupRenderer: React.ComponentType<GroupRendererProps> = ({schema, children, noGrid}) => {
    const {readDense, readActive} = useUIMeta<UIMetaReadContextType>()
    return noGrid ? children as unknown as React.ReactElement :
        <Grid
            container
            spacing={
                readActive && readDense ? 1 :
                    typeof schema.getIn(['view', 'spacing']) === 'number' ? schema.getIn(['view', 'spacing']) as GridSpacing | undefined
                        : 2}
            wrap={'wrap'}
        >
            {children}
        </Grid>
}

const customWidgets = {...widgets}
customWidgets.GroupRenderer = GroupRenderer
const pluginStack = [...customWidgets.pluginStack]
// the referencing network handler should be at first position
// must be before the `ReferencingHandler`, thus if the root schema for the level is a network schema,
// the network handler can download it, and the normal referencing handler may handle references inside of e.g. `if`
// maybe the network handlers adds a generic prop `resolveNetworkRef`, to request network schema inside e.g. an `if` from inside the ReferencingHandler
// pluginStack.splice(0, 0, ReferencingNetworkHandler)
customWidgets.pluginStack = pluginStack

//widgets.types.null = () => 'null'

const Main = ({classes}: { classes: { paper: string } }) => {
    return <React.Fragment>
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                <ReadableWritableEditor/>
            </Paper>
        </Grid>
    </React.Fragment>
}

const formSchema = createOrderedMap({
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
        category: {
            type: 'string',
            widget: 'Select',
            enum: ['order', 'request', 'refund'],
        },
        value: {
            type: 'number',
        },
        comment: {
            type: 'string',
            widget: 'Text',
        },
    },
})

export interface ReadWidgetsBinding {
    types: {
        [k: string]: WidgetType<UIMetaReadContextType, MuiWidgetBinding>
    }
    custom: {
        [k: string]: WidgetType<UIMetaReadContextType, MuiWidgetBinding>
    }
}

const readWidgets: ReadWidgetsBinding = {
    types: {
        string: StringRendererRead,
        number: NumberRendererRead,
        int: NumberRendererRead,
    },
    custom: {
        Text: TextRendererRead,
        Select: WidgetSelectRead,
    },
}

const ReadableWritableEditor = () => {
    const {widgets, t} = useUIMeta()
    const showValidity = true
    const [store, setStore] = React.useState(() => createStore(OrderedMap()))
    const [edit, setEdit] = React.useState(false)
    const [dense, setDense] = React.useState(false)

    const onChange = React.useCallback((actions: UIStoreActions[] | UIStoreActions) => {
        setStore(storeUpdater<UIStoreType>(actions))
    }, [setStore])

    const customWidgetsRtd = React.useMemo(() => ({
        ...widgets,
        types: edit ? widgets.types : readWidgets.types,
        custom: edit ? widgets.custom : readWidgets.custom,
    }), [widgets, edit, readWidgets])

    return <React.Fragment>
        <Box mb={1}>
            <Button onClick={() => setEdit(e => !e)}>{edit ? 'ready only' : 'edit'}</Button>
            <Button disabled={edit} onClick={() => setDense(e => !e)}>{dense ? 'normal-size' : 'dense'}</Button>
        </Box>
        <UIMetaProvider<UIMetaReadContextType> widgets={customWidgetsRtd} t={t} readActive={!edit} readDense={dense}>
            <UIStoreProvider<{}, any, UIStoreActions>
                store={store}
                onChange={onChange}
                showValidity={showValidity}
            >
                <UIRootRenderer schema={formSchema}/>
                <MuiSchemaDebug schema={formSchema}/>
            </UIStoreProvider>
        </UIMetaProvider>
    </React.Fragment>
}

// eslint-disable-next-line react/display-name,@typescript-eslint/explicit-module-boundary-types
export default () => <AppTheme>
    <div>
        <UIMetaProvider widgets={customWidgets} t={browserT}>
            <Dashboard main={Main}/>
        </UIMetaProvider>
    </div>
</AppTheme>
