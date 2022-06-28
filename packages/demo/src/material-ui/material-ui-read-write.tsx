import React from 'react'
import AppTheme from './layout/AppTheme'
import Dashboard from './dashboard/Dashboard'
import Grid, { GridSpacing } from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { MuiWidgetBinding, SelectChips, widgets } from '@ui-schema/ds-material'
import {
    createOrderedMap, createStore,
    GroupRendererProps,
    UIMetaProvider, UIStoreProvider,
    useUIMeta, WidgetType,
    UIStoreActions, UIStoreType, injectPluginStack,
} from '@ui-schema/ui-schema'
import { browserT } from '../t'
import { storeUpdater } from '@ui-schema/ui-schema/storeUpdater'
import { OrderedMap } from 'immutable'
import { MuiSchemaDebug } from './component/MuiSchemaDebug'
import { UIMetaReadContextType } from '@ui-schema/ui-schema/UIMetaReadContext'
import {
    NumberRendererRead, StringRendererRead, TextRendererRead,
    WidgetBooleanRead, WidgetChipsRead,
} from '@ui-schema/ds-material/WidgetsRead'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import { WidgetOptionsRead } from '@ui-schema/ds-material/WidgetsRead/WidgetOptionsRead'

// custom `GroupRenderer` that supports `is-read and display-dense`
const GroupRenderer: React.ComponentType<GroupRendererProps> = ({schema, children, noGrid}) => {
    const {readDense, readActive} = useUIMeta<UIMetaReadContextType>()
    return noGrid ? children as unknown as React.ReactElement :
        <Grid
            container
            spacing={
                readActive && readDense ? 1 :
                    typeof schema.getIn(['view', 'spacing']) === 'number' ?
                        schema.getIn(['view', 'spacing']) as GridSpacing | undefined :
                        2
            }
            wrap={'wrap'}
        >
            {children}
        </Grid>
}

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
            view: {
                sizeMd: 6,
            },
        },
        checker: {
            type: 'boolean',
            view: {
                sizeMd: 6,
            },
        },
        comment: {
            type: 'string',
            widget: 'Text',
        },

        layouts: {
            type: 'array',
            widget: 'OptionsCheck',
            view: {
                sizeMd: 3,
            },
            items: {
                oneOf: [
                    {
                        const: 'notice',
                    }, {
                        const: 'content',
                    }, {
                        const: 'footer',
                    },
                ],
            },
        },
        sizeDef: {
            type: 'string',
            widget: 'OptionsRadio',
            default: 'middle',
            view: {
                sizeMd: 3,
            },
            enum: [
                'small',
                'middle',
                'big',
            ],
        },
        topics: {
            type: 'array',
            widget: 'SelectMulti',
            view: {
                sizeMd: 3,
            },
            items: {
                oneOf: [
                    {const: 'theater'},
                    {const: 'crime'},
                    {const: 'sci-fi'},
                    {const: 'horror'},
                ],
            },
        },
        services: {
            type: 'array',
            widget: 'SelectChips',
            //default: "adult",
            view: {
                sizeMd: 3,
            },
            items: {
                type: 'string',
                oneOf: [
                    {const: 'development'},
                    {const: 'design'},
                    {const: 'hosting'},
                    {const: 'consulting'},
                ],
            },
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

// Notice: `customWidgets` are supplied by the global `UIMetaProvider` at the end of this file,
//         while `readWidgets` are supplied in the nested `UIMetaProvider` - which re-uses everything else from the global provider
const customWidgets = {...widgets}
customWidgets.GroupRenderer = GroupRenderer
customWidgets.custom = {
    ...customWidgets.custom,
    SelectChips: SelectChips,
}

const readWidgets: ReadWidgetsBinding = {
    types: {
        string: StringRendererRead,
        number: NumberRendererRead,
        int: NumberRendererRead,
        boolean: WidgetBooleanRead,
    },
    custom: {
        Text: TextRendererRead,
        Select: WidgetOptionsRead,
        SelectMulti: WidgetOptionsRead,
        SelectChips: WidgetChipsRead,
        OptionsRadio: WidgetOptionsRead,
        OptionsCheck: WidgetOptionsRead,
    },
}

const GridStack = injectPluginStack(GridContainer)
const ReadableWritableEditor = () => {
    const {widgets, ...metaCtx} = useUIMeta()
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
    }), [widgets, edit])

    return <React.Fragment>
        <Box mb={1}>
            <Button onClick={() => setEdit(e => !e)}>{edit ? 'ready only' : 'edit'}</Button>
            <Button disabled={edit} onClick={() => setDense(e => !e)}>{dense ? 'normal-size' : 'dense'}</Button>
        </Box>
        <UIMetaProvider<UIMetaReadContextType>
            // re-use & overwrite of the global meta-context
            widgets={customWidgetsRtd} {...metaCtx}
            // custom meta-ctx only available within this UIMetaProvider context
            readActive={!edit} readDense={dense}
        >
            <UIStoreProvider<{}, any, UIStoreActions>
                store={store}
                onChange={onChange}
                showValidity={showValidity}
            >
                <GridStack isRoot schema={formSchema}/>
                <MuiSchemaDebug schema={formSchema}/>
            </UIStoreProvider>
        </UIMetaProvider>
    </React.Fragment>
}

// eslint-disable-next-line react/display-name
export default (): React.ReactElement =>
    <AppTheme>
        <UIMetaProvider widgets={customWidgets} t={browserT}>
            <Dashboard main={Main}/>
        </UIMetaProvider>
    </AppTheme>
