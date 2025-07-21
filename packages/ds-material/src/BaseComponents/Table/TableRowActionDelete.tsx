import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Delete from '@mui/icons-material/Delete'
import { Translate } from '@ui-schema/react/Translate'
import { onChangeHandler, StoreKeys } from '@ui-schema/react/UIStore'
import type { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import { AccessTooltipIcon } from '@ui-schema/ds-material/Component/Tooltip'
import { TableRowProps } from '@ui-schema/ds-material/BaseComponents/Table'
import { Map } from 'immutable'

export interface TableRowActionDeleteProps {
    onChange: onChangeHandler
    storeKeys: StoreKeys
    showRows: TableRowProps['showRows']
    setPage: TableRowProps['setPage']
    index: number
    deleteOnEmpty: boolean
    schema: SomeSchema | undefined
}

export const TableRowActionDelete: React.ComponentType<TableRowActionDeleteProps> = (
    {
        onChange, storeKeys,
        showRows = 0, setPage,
        index, deleteOnEmpty, schema,
    },
) => {
    return <IconButton
        color="inherit"
        onClick={() => {
            onChange({
                type: 'list-item-delete',
                storeKeys: storeKeys.splice(-1, 1) as StoreKeys,
                index: index,
                effect: ({value}) => {
                    if (value && showRows !== -1) {
                        setPage(p => {
                            const nextPage = (Math.ceil(value.size / showRows) || 1) - 1
                            return (p < nextPage ? p : nextPage)
                        })
                    }
                },
                schema: Map({type: 'array'}) as SomeSchema,
                required: deleteOnEmpty,
            })
        }}
        size={'small'}
    >
        <AccessTooltipIcon
            title={
                <Translate text={'labels.remove-row'} context={Map({actionLabels: schema?.get('tableActionLabels')})}/>
            }
        >
            <Delete fontSize={'inherit'} style={{margin: 2}}/>
        </AccessTooltipIcon>
    </IconButton>
}
