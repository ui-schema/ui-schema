import Paper from '@mui/material/Paper'
import React from 'react'
import Button from '@mui/material/Button'
import { MuiSchemaDebug } from './MuiSchemaDebug'
import { MainDummy } from '../../component/MainDummy'

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
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                overflow: 'auto',
                flexDirection: 'column',
            }}
        >
            <MainDummy Debugger={MuiSchemaDebug} Button={Button} schema={schema}/>
        </Paper> : null}
</React.Fragment>
