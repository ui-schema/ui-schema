import React from 'react'
import IconButton from '@mui/material/IconButton'
import Delete from '@mui/icons-material/Delete'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { Translate } from '@ui-schema/react/Translate'
import { onChangeHandler, StoreKeys } from '@ui-schema/react/UIStore'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { AccessTooltipIcon } from '@ui-schema/ds-material/Component/Tooltip'
import { TableRowProps } from '@ui-schema/ds-material/BaseComponents/Table'
import { Map } from 'immutable'

export interface TableRowActionDeleteProps {
    onChange: onChangeHandler
    storeKeys: WidgetProps['storeKeys']
    schemaKeys: WidgetProps['schemaKeys']
    showRows: TableRowProps['showRows']
    setPage: TableRowProps['setPage']
    index: number
    deleteOnEmpty: boolean
    schema: UISchemaMap | undefined
}

export const TableRowActionDelete: React.ComponentType<TableRowActionDeleteProps> = (
    {
        onChange, storeKeys,
        showRows = 0, setPage,
        index, deleteOnEmpty, schema,
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
                schema: Map({type: 'array'}) as UISchemaMap,
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
