import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Delete from '@material-ui/icons/Delete'
import { StoreKeys, Trans, WidgetProps } from '@ui-schema/ui-schema'
import { AccessTooltipIcon } from '@ui-schema/ds-material/Component/Tooltip/Tooltip'
import { TableRowProps } from '@ui-schema/ds-material'

export interface TableRowActionDeleteProps {
    onChange: WidgetProps['onChange']
    storeKeys: WidgetProps['storeKeys']
    showRows: TableRowProps['showRows']
    setPage: TableRowProps['setPage']
    index: number
    deleteOnEmpty: boolean
}

export const TableRowActionDelete: React.ComponentType<TableRowActionDeleteProps> = (
    {
        onChange, storeKeys,
        showRows, setPage,
        index, deleteOnEmpty,
    }
) => {
    return <IconButton
        color="inherit"
        onClick={() => {
            onChange(
                storeKeys.splice(storeKeys.size - 1, 1) as StoreKeys, ['value', 'internal'],
                ({value, internal}) => {
                    if (showRows !== -1) {
                        setPage(p => {
                            const nextPage = (Math.ceil((value.size - 1) / showRows) || 1) - 1
                            return (p < nextPage ? p : nextPage)
                        })
                    }
                    return ({
                        value: value.splice(index, 1),
                        internal: internal?.splice(index, 1),
                    })
                },
                deleteOnEmpty,
                'array'
            )
        }}
        size={'small'}
    >
        {/* @ts-ignore */}
        <AccessTooltipIcon title={<Trans text={'labels.remove-row'}/>}>
            <Delete fontSize={'inherit'}/>
        </AccessTooltipIcon>
    </IconButton>
}
