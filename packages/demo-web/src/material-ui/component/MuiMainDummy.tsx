import React from 'react'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { MuiSchemaDebug } from './MuiSchemaDebug'
import { MainDummy } from '../../component/MainDummy'

export const DummyRenderer: React.FC<{
    id: string
    schema: any
    toggleDummy?: (id: string) => void
    getDummy?: (id: string) => boolean
    variant?: 'outlined' | 'elevation'
    open?: boolean
    stylePaper?: React.CSSProperties
}> = ({id, schema, toggleDummy, getDummy, variant, open = false, stylePaper = {}}) => <React.Fragment>
    {open || !toggleDummy ? null :
        <Button style={{marginBottom: 12}} onClick={() => toggleDummy(id)} variant={(getDummy && getDummy(id) ? 'contained' : 'outlined')}>
            {id.replace(/([A-Z0-9])/g, ' $1').replace(/^./, str => str.toUpperCase())}
        </Button>}
    {(getDummy && getDummy(id)) || open || !toggleDummy ?
        <Paper
            style={stylePaper}
            // outlined or elevation
            variant={variant}
            sx={{
                p: 2,
                display: 'flex',
                overflow: 'auto',
                flexDirection: 'column',
            }}
        >
            <MainDummy
                schema={schema}
                Debugger={MuiSchemaDebug}
                Button={Button}
            />
        </Paper> : null}
</React.Fragment>
