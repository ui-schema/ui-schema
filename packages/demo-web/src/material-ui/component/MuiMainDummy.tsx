import React from 'react'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { MuiSchemaDebug } from './MuiSchemaDebug'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { createEmptyStore, UIStoreProvider } from '@ui-schema/react/UIStore'
import Grid from '@mui/material/Grid'
import { List } from 'immutable'
import { StoreKeys } from '@ui-schema/system/ValueStore'
import { browserT } from '../../t'
import { isInvalid } from '@ui-schema/react/ValidityReporter'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { memo } from '@ui-schema/react/Utils/memo'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'

interface MainDummyProps {
    schema: UISchemaMap
}

const WidgetEngineMemo = memo(WidgetEngine)

const MainDummy: React.FC<MainDummyProps> = ({schema}) => {
    const [showValidity, setShowValidity] = React.useState(false)
    const [store, setStore] = React.useState(() => createEmptyStore(schema.get('type')))

    const onChange = React.useCallback((actions) => setStore(storeUpdater(actions)), [setStore])

    return <UIStoreProvider
        store={store}
        onChange={onChange}
        showValidity={showValidity}
        //doNotDefault
    >
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                overflow: 'auto',
                flexDirection: 'column',
            }}
        >
            {/*<GridStack isRoot schema={schema}/>*/}
            <Grid container spacing={2}>
                <WidgetEngineMemo
                    storeKeys={List([]) as StoreKeys}
                    schemaKeys={List([]) as StoreKeys}
                    schema={schema}
                    parentSchema={undefined}
                    required={false}
                    t={browserT}
                    isVirtual={false}
                    noGrid={false}
                />
            </Grid>

            <Button onClick={() => setShowValidity(!showValidity)}>{showValidity ? 'hide ' : ''}validity</Button>
            {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}
        </Paper>

        <MuiSchemaDebug setSchema={undefined} schema={schema}/>
    </UIStoreProvider>

}

export const DummyRenderer: React.FC<{
    id: string
    schema: any
    toggleDummy?: (id: string) => void
    getDummy?: (id: string) => boolean
    open?: boolean
}> = ({id, schema, toggleDummy, getDummy, open = false}) => <React.Fragment>
    {open || !toggleDummy ? null :
        <Button style={{marginBottom: 12}} onClick={() => toggleDummy(id)} variant={(getDummy && getDummy(id) ? 'contained' : 'outlined')}>
            {id.replace(/([A-Z0-9])/g, ' $1').replace(/^./, str => str.toUpperCase())}
        </Button>}
    {(getDummy && getDummy(id)) || open || !toggleDummy ?
        <MainDummy schema={schema}/> : null}
</React.Fragment>
