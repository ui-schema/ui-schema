import React from 'react'
import AppTheme from './layout/AppTheme'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Label from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Dashboard from './dashboard/Dashboard'
import { MuiWidgetsBindingCustom, MuiWidgetsBindingTypes, widgets } from '@ui-schema/ds-material'
import { browserT } from '../t'
import { MuiSchemaDebug } from './component/MuiSchemaDebug'
import { isInvalid } from '@ui-schema/react/ValidityReporter/isInvalid'
import { schemaDragDropSortableList1, schemaDragDropSortableList2, schemaDragDropSortableList3, schemaDragDropSortableList4, schemaDragDropSortableList5 } from '../schemas/demoDragDrop'
import { DndProvider } from 'react-dnd'
import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { createEmptyStore, createStore, injectWidgetEngine, SchemaTypesType, UISchemaMap, storeUpdater, UIMetaProvider, UIStoreProvider, UIStoreType, WidgetProps, WidgetsBindingFactory, WithScalarValue } from '@ui-schema/ui-schema'
import { List } from 'immutable'
import { KitDndProvider, useOnIntent } from '@ui-schema/kit-dnd'
import { useOnDirectedMove } from '@ui-schema/material-dnd/useOnDirectedMove'
import { DragDropSpec } from '@ui-schema/material-dnd/DragDropSpec'
import { SortableList } from '@ui-schema/material-dnd/Widgets/SortableList/SortableList'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'

type CustomWidgetsBinding = WidgetsBindingFactory<{}, MuiWidgetsBindingTypes<{}>, MuiWidgetsBindingCustom<{}> & {
    SortableList: React.ComponentType<WidgetProps<CustomWidgetsBinding> & WithScalarValue>
}>
const customWidgets: CustomWidgetsBinding = {...widgets} as CustomWidgetsBinding
customWidgets.custom = {
    ...widgets.custom,
    SortableList: SortableList,
}

const schemas: [UISchemaMap, boolean][] = [
    [schemaDragDropSortableList1 as UISchemaMap, true],
    [schemaDragDropSortableList2 as UISchemaMap, false],
    [schemaDragDropSortableList3 as UISchemaMap, false],
    [schemaDragDropSortableList4 as UISchemaMap, true],
    [schemaDragDropSortableList5 as UISchemaMap, false],
]

const GridStack = injectWidgetEngine(GridContainer)
const SingleEditor = () => {
    const [showValidity, setShowValidity] = React.useState(false)

    const [schema, setSchema] = React.useState<number>(0)
    const [store, setStore] = React.useState<UIStoreType>(() => createStore(List()))

    const onChange = React.useCallback((actions) => {
        setStore(prevStore => {
            return storeUpdater(actions)(prevStore)
        })
    }, [setStore])

    const {onIntent} = useOnIntent<HTMLDivElement, DragDropSpec>({edgeSize: 12})
    const {onMove} = useOnDirectedMove<HTMLDivElement, DragDropSpec>(onIntent, onChange)

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
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                <UIStoreProvider
                    store={store}
                    onChange={onChange}
                    showValidity={showValidity}
                >
                    <GridStack isRoot schema={schemas[schema][0]}/>
                    <MuiSchemaDebug schema={schemas[schema][0]}/>
                </UIStoreProvider>
            </DndProvider>
        </KitDndProvider>

        <div style={{width: '100%'}}>
            <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
            <div>
                {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}
            </div>
        </div>
    </React.Fragment>
}

const Main = () => {
    return <React.Fragment>
        <SingleEditor/>
    </React.Fragment>
}

// @ts-ignore
// eslint-disable-next-line react/display-name
export default () => <AppTheme>
    <UIMetaProvider widgets={customWidgets} t={browserT}>
        <Dashboard main={Main}/>
    </UIMetaProvider>
</AppTheme>

export { customWidgets }
