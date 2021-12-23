import React from 'react'
import AppTheme from './layout/AppTheme'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import MenuItem from '@material-ui/core/MenuItem'
import Label from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Dashboard from './dashboard/Dashboard'
import { MuiWidgetsBindingCustom, MuiWidgetsBindingTypes, widgets } from '@ui-schema/ds-material'
import { browserT } from '../t'
import { MuiSchemaDebug } from './component/MuiSchemaDebug'
import { isInvalid } from '@ui-schema/ui-schema/ValidityReporter/isInvalid'
import { schemaDragDropSortableList1, schemaDragDropSortableList2, schemaDragDropSortableList3, schemaDragDropSortableList4, schemaDragDropSortableList5 } from '../schemas/demoDragDrop'
import { DndProvider } from 'react-dnd'
import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { createEmptyStore, createStore, SchemaTypesType, StoreSchemaType, storeUpdater, UIMetaProvider, UIStoreProvider, UIStoreType, WidgetProps, WidgetsBindingFactory, WithScalarValue } from '@ui-schema/ui-schema'
import { List } from 'immutable'
import { UIRootRenderer } from '@ui-schema/ui-schema/UIRootRenderer'
import { KitDndProvider, useOnIntent } from '@ui-schema/kit-dnd'
import { useOnDirectedMove } from '@ui-schema/material-dnd/useOnDirectedMove'
import { DragDropSpec } from '@ui-schema/material-dnd/DragDropSpec'
import { SortableList } from '@ui-schema/material-dnd/Widgets/SortableList/SortableList'

type CustomWidgetsBinding = WidgetsBindingFactory<{}, MuiWidgetsBindingTypes<{}>, MuiWidgetsBindingCustom<{}> & {
    SortableList: React.ComponentType<WidgetProps<{}, CustomWidgetsBinding> & WithScalarValue>
}>
const customWidgets: CustomWidgetsBinding = {...widgets} as CustomWidgetsBinding
customWidgets.custom = {
    ...widgets.custom,
    SortableList: SortableList,
}

const schemas: [StoreSchemaType, boolean][] = [
    [schemaDragDropSortableList1, true],
    [schemaDragDropSortableList2, false],
    [schemaDragDropSortableList3, false],
    [schemaDragDropSortableList4, true],
    [schemaDragDropSortableList5, false],
]

const SingleEditor = () => {
    const [showValidity, setShowValidity] = React.useState(false)

    const [schema, setSchema] = React.useState<number>(0)
    const [store, setStore] = React.useState<UIStoreType>(() => createStore(List()))

    const onChange = React.useCallback((storeKeys, scopes, updater) => {
        setStore(prevStore => {
            return storeUpdater(storeKeys, scopes, updater)(prevStore)
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
                    <UIRootRenderer schema={schemas[schema][0]}/>
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
