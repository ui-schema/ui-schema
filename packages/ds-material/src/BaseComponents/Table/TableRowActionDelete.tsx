import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Delete from '@material-ui/icons/Delete'
import { onChangeHandler, StoreKeys, StoreSchemaType, Trans, WidgetProps } from '@ui-schema/ui-schema'
import { AccessTooltipIcon } from '@ui-schema/ds-material/Component/Tooltip/Tooltip'
import { TableRowProps } from '@ui-schema/ds-material'
import { Map } from 'immutable'

export interface TableRowActionDeleteProps {
    onChange: onChangeHandler
    storeKeys: WidgetProps['storeKeys']
    showRows: TableRowProps['showRows']
    setPage: TableRowProps['setPage']
    index: number
    deleteOnEmpty: boolean
}

export const TableRowActionDelete: React.ComponentType<TableRowActionDeleteProps> = (
    {
        onChange, storeKeys,
        showRows = 0, setPage,
        index, deleteOnEmpty,
    }
) => {
    return <IconButton
        color="inherit"
        onClick={() => {
            onChange({
                type: 'list-item-delete',
                storeKeys: storeKeys.splice(-1, 1) as StoreKeys,
                scopes: ['value', 'internal'],
                index: index,
                effect: ({value}) => {
                    if (showRows !== -1) {
                        setPage(p => {
                            const nextPage = (Math.ceil(value.size / showRows) || 1) - 1
                            return (p < nextPage ? p : nextPage)
                        })
                    }
                },
                schema: Map({type: 'array'}) as StoreSchemaType,
                required: deleteOnEmpty,
            })
        }}
        size={'small'}
    >
        {/* @ts-ignore */}
        <AccessTooltipIcon title={<Trans text={'labels.remove-row'}/>}>
            <Delete fontSize={'inherit'}/>
        </AccessTooltipIcon>
    </IconButton>
}
