import * as React from 'react'
import { ErrorFallbackProps } from '@ui-schema/react/Widget'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import { List } from 'immutable'

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({type, widget, storeKeys}) => (
    <Alert severity={'error'}>
        <Typography color={'error'}><strong>System Error in Widget!</strong></Typography>
        <Typography><strong>Type:</strong> {List.isList(type) ? type.join(', ') : (type || '-')}</Typography>
        <Typography><strong>Widget:</strong> {widget || '-'}</Typography>
        <Typography variant={'caption'}><strong>Keys:</strong> <code>{JSON.stringify(storeKeys?.toJS())}</code></Typography>
    </Alert>
)
