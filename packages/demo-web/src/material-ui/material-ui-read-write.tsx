import React from 'react'
import AppTheme from './layout/AppTheme'
import Dashboard from './layout/Dashboard'
import Grid, { GridSpacing } from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { MuiWidgetsBinding } from '@ui-schema/ds-material/WidgetsBinding'
import { SelectChips } from '@ui-schema/ds-material/Widgets/SelectChips'
import { browserT } from '../t'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { OrderedMap } from 'immutable'
import { MuiSchemaDebug } from './component/MuiSchemaDebug'
import { UIMetaReadContextType } from '@ui-schema/react/UIMetaReadContext'
import {
    NumberRendererRead, StringRendererRead, TextRendererRead,
    WidgetBooleanRead, WidgetChipsRead,
} from '@ui-schema/ds-material/WidgetsRead'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import * as WidgetsDefault from '@ui-schema/ds-material/WidgetsDefault'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import { WidgetOptionsRead } from '@ui-schema/ds-material/WidgetsRead/WidgetOptionsRead'
import { GroupRendererProps, WidgetType } from '@ui-schema/react/Widgets'
import { UIMetaProvider, useUIMeta } from '@ui-schema/react/UIMeta'
import { createOrderedMap } from '@ui-schema/system/createMap'
import { InfoRenderer, InfoRendererProps } from '@ui-schema/ds-material/Component/InfoRenderer'
import { injectWidgetEngine } from '@ui-schema/react/applyWidgetEngine'
import { createStore, UIStoreProvider, UIStoreType } from '@ui-schema/react/UIStore'
import { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import { isInvalid } from '@ui-schema/react/ValidityReporter'
import { ObjectRenderer } from '@ui-schema/react/ObjectRenderer'

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
        [k: string]: WidgetType<UIMetaReadContextType, MuiWidgetsBinding>
    }
    custom: {
        [k: string]: WidgetType<UIMetaReadContextType, MuiWidgetsBinding>
    }
}

// Notice: `customWidgets` are supplied by the global `UIMetaProvider` at the end of this file,
//         while `readWidgets` are supplied in the nested `UIMetaProvider` - which re-uses everything else from the global provider
const {widgetPlugins, schemaPlugins} = WidgetsDefault.plugins()
const customWidgets = {
    ...WidgetsDefault.define<{ InfoRenderer?: React.ComponentType<InfoRendererProps> }, {}>({
        InfoRenderer: InfoRenderer,
        widgetPlugins: widgetPlugins,
        schemaPlugins: schemaPlugins,
        types: WidgetsDefault.widgetsTypes(),
        custom: {
            ...WidgetsDefault.widgetsCustom(),
            SelectChips: SelectChips,
        },
    }),
    GroupRenderer: GroupRenderer,
}

const readWidgets: ReadWidgetsBinding = {
    types: {
        object: ObjectRenderer,
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

const GridStack = injectWidgetEngine(GridContainer)
const ReadableWritableEditor = () => {
    const {widgets, ...metaCtx} = useUIMeta()
    const [showValidity, setShowValidity] = React.useState(true)
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
        <div style={{width: '100%', marginTop: 24}}>
            <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
            <div>
                {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}
            </div>
        </div>
    </React.Fragment>
}

// eslint-disable-next-line react/display-name
export default (): React.ReactElement =>
    <AppTheme>
        <UIMetaProvider widgets={customWidgets} t={browserT}>
            <Dashboard>
                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            overflow: 'auto',
                            flexDirection: 'column',
                        }}
                    >
                        <ReadableWritableEditor/>
                    </Paper>
                </Grid>
            </Dashboard>
        </UIMetaProvider>
    </AppTheme>
