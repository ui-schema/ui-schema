/* eslint-disable @typescript-eslint/no-deprecated */
import { widgetsExtended } from '@ui-schema/ds-material/Binding/WidgetsExtended'
import { bindingComponents } from '@ui-schema/ds-material/Binding/Components'
import { widgetsDefault } from '@ui-schema/ds-material/Binding/WidgetsDefault'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import { DragDropBlockComponentsBinding } from '@ui-schema/material-dnd'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import type { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import React from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Label from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { browserT } from '../t'
import { MuiSchemaDebug } from './component/MuiSchemaDebug'
import { isInvalid } from '@ui-schema/react/isInvalid'
import { schemaDragDropNested, schemaDragDropScoped } from '../schemas/demoDragDrop'
import { DndProvider } from 'react-dnd'
import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { TouchTransition, PointerTransition, MultiBackendOptions } from 'dnd-multi-backend'
import { OrderedMap } from 'immutable'
import { DndBlock, DragDropBlockProvider } from '@ui-schema/material-dnd/DragDropBlockProvider'
import { KitDndProvider, useOnIntent } from '@ui-schema/kit-dnd'
import { useOnDirectedMove } from '@ui-schema/material-dnd/useOnDirectedMove'
import { DragDropSpec } from '@ui-schema/material-dnd/DragDropSpec'
import { SortableList } from '@ui-schema/material-dnd/Widgets/SortableList'
import { DragDropArea } from '@ui-schema/material-dnd/Widgets/DragDropArea'
import { DragDropBlockSelector } from '@ui-schema/material-dnd/DragDropBlockSelector'
import { DropArea } from '@ui-schema/material-dnd/Widgets/DropArea'
import { createEmptyStore, createStore, onChangeHandler, UIStoreProvider, UIStoreType } from '@ui-schema/react/UIStore'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { UIMetaContext, UIMetaProvider } from '@ui-schema/react/UIMeta'
import { MuiBindingWidgets } from '@ui-schema/ds-material/BindingType'
import { WidgetProps, BindingTypeGeneric } from '@ui-schema/react/Widget'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { widgetPluginsLegacy } from './widgetPluginsLegacy'

type CustomWidgetsBinding = BindingTypeGeneric<MuiBindingWidgets<UIStoreActions, WidgetProps<BindingTypeGeneric<any> & DragDropBlockComponentsBinding>>> & DragDropBlockComponentsBinding

const customWidgets: CustomWidgetsBinding = {
    ...bindingComponents,
    widgetPlugins: widgetPluginsLegacy,
    DndBlockSelector: DragDropBlockSelector,
    widgets: {
        ...widgetsDefault,
        ...widgetsExtended,
        DropArea: DropArea,
        DragDropArea: DragDropArea,
        SortableList: SortableList,
    },
}

const blocks: DndBlock[] = [
    {
        type: 'area',
        typeKey: '_block',
        idKey: '_bid',
        isDroppable: true,
        listKey: 'list',
        schema: createOrderedMap({
            type: 'object',
            widget: 'DragDropArea',
            //dragDrop: {listPath: '/list'},
            properties: {
                _bid: {
                    type: 'string',
                },
                _block: {
                    type: 'string',
                },
                list: {
                    type: 'array',
                },
            },
        }),
    },
    {
        type: 'address',
        typeKey: '_block',
        idKey: '_bid',
        schema: createOrderedMap({
            type: 'object',
            //widget: 'DragArea',
            properties: {
                name: {
                    type: 'string',
                },
            },
        }),
    },
    {
        type: 'addresses',
        typeKey: '_block',
        idKey: '_bid',
        isDroppable: true,
        listKey: 'addresses',
        schema: createOrderedMap({
            type: 'array',
            widget: 'DragDropArea',
            title: 'Addresses',
            view: {
                showTitle: true,
            },
            dragDrop: {
                allowed: ['address'],
            },
            addresses: {
                type: 'array',
            },
        }),
    },
]

const schemas: [UISchemaMap, boolean][] = [
    [schemaDragDropNested as UISchemaMap, true],
    [schemaDragDropScoped as UISchemaMap, true],
]

export const HTML5toTouch: MultiBackendOptions = {
    backends: [
        {
            id: 'html5',
            backend: HTML5Backend,
            transition: PointerTransition,
        },
        {
            id: 'touch',
            backend: TouchBackend,
            options: {enableMouseEvents: true},
            preview: true,
            transition: TouchTransition,
        },
    ],
}

const SingleEditor = () => {
    const [showValidity, setShowValidity] = React.useState(false)

    const [schema, setSchema] = React.useState<number>(0)
    const [store, setStore] = React.useState<UIStoreType>(() => createStore(OrderedMap()))

    const onChange: onChangeHandler = React.useCallback((actions) => {
        setStore(prevStore => {
            return storeUpdater(actions)(prevStore)
        })
    }, [setStore])

    const {onIntent} = useOnIntent<HTMLDivElement, DragDropSpec>({edgeSize: 12})
    const {onMove} = useOnDirectedMove<HTMLDivElement, DragDropSpec>(
        onIntent, onChange,
    )

    return <React.Fragment>
        <Box mb={2}>
            <FormControl>
                <Label>Select Schema</Label>
                <Select
                    value={schema}
                    // @ts-ignore
                    onChange={e => {
                        // @ts-ignore
                        const s = e.target.value as number
                        setSchema(s)
                        setStore(createEmptyStore(schemas[s][0].get('type') as SchemaTypesType))
                    }}
                    displayEmpty
                >
                    {schemas.map((schema, i) => (
                        <MenuItem key={i} value={i} disabled={!schema[1]}>{schema[0].get('title')}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>

        <KitDndProvider<HTMLDivElement, DragDropSpec> onMove={onMove}>
            <DragDropBlockProvider blocks={blocks}>
                <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                    <UIStoreProvider
                        store={store}
                        onChange={onChange}
                        showValidity={showValidity}
                    >
                        <GridContainer>
                            <WidgetEngine isRoot schema={schemas[schema][0]}/>
                        </GridContainer>
                        <MuiSchemaDebug schema={schemas[schema][0]}/>
                    </UIStoreProvider>
                </DndProvider>
            </DragDropBlockProvider>
        </KitDndProvider>

        <div style={{width: '100%'}}>
            <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
            <div>
                {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}
            </div>
        </div>
    </React.Fragment>
}

// @ts-ignore
// eslint-disable-next-line react/display-name
export default () => <>
    <UIMetaProvider<UIMetaContext<CustomWidgetsBinding>, CustomWidgetsBinding>
        binding={customWidgets}
        t={browserT}
    >
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        overflow: 'auto',
                        flexDirection: 'column',
                    }}
                >
                    <SingleEditor/>
                </Paper>
            </Grid>
        </Grid>
    </UIMetaProvider>
</>

export { customWidgets }
