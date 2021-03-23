import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Add from '@material-ui/icons/Add'
import { memo, Trans, WidgetProps } from '@ui-schema/ui-schema'
import { ValidityHelperText } from '../../Component/LocaleHelperText/LocaleHelperText'
import { List, Map } from 'immutable'
import { AccessTooltipIcon } from '../../Component/Tooltip/Tooltip'
import Typography from '@material-ui/core/Typography'
import TablePagination from '@material-ui/core/TablePagination'
import MuiTableFooter from '@material-ui/core/TableFooter'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { TablePaginationActions } from '@ui-schema/ds-material/Widgets/Table/TablePaginationActions'

let TableFooter: React.ComponentType<{
    dense?: boolean
    readOnly?: boolean
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    listSize: number
    listSizeCurrent: number
    rows: number
    setRows: React.Dispatch<React.SetStateAction<number>>
    onChange: WidgetProps['onChange']
    storeKeys: WidgetProps['storeKeys']
    schema: WidgetProps['schema']
    showValidity: WidgetProps['showValidity']
    valid: WidgetProps['valid']
    errors: WidgetProps['errors']
    btnSize: 'small' | 'medium'
    colSize: number
}> = (
    {
        dense,
        readOnly,
        page,
        setPage,
        setRows,
        listSize,
        listSizeCurrent,
        rows,
        onChange,
        storeKeys,
        schema,
        btnSize,
        colSize,
        valid,
        showValidity,
        errors,
    }
) => {
    return <MuiTableFooter>
        <TableRow>
            <TableCell
                size={dense ? 'small' : 'medium'}
            >
                {!readOnly ?
                    <IconButton
                        onClick={() => {
                            setPage(Number(Math.ceil((listSizeCurrent + 1) / rows)) - 1)
                            onChange(
                                storeKeys, ['value', 'internal'],
                                ({value = List(), internal = List()}) => ({
                                    value: value.push(schema.getIn(['items', 'type']) === 'object' ? Map() : List([undefined, value.size + 1])),
                                    internal: internal.push(schema.getIn(['items', 'type']) === 'object' ? Map() : List()),
                                })
                            )
                        }}
                        size={btnSize}
                        style={{marginRight: 6}}
                    >
                        {/* @ts-ignore */}
                        <AccessTooltipIcon title={<Trans text={'labels.add-row'}/>}>
                            <Add fontSize={'inherit'}/>
                        </AccessTooltipIcon>
                    </IconButton> : null}

                <Typography component={'span'} variant={'body2'} style={{verticalAlign: 'middle'}}>
                    <Trans text={'pagination.total'}/>{': ' + (listSize || 0)}
                </Typography>
            </TableCell>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, {label: 'All', value: -1}]}
                colSpan={
                    colSize + 1
                }
                count={listSize || 0}
                rowsPerPage={rows}
                page={page}
                SelectProps={{
                    inputProps: {'aria-label': 'Rows per page'},
                    //inputProps: {'aria-label': <Trans text={'pagination.rows-per-page'}/>},
                    //native: true,
                }}
                onChangePage={(_e, p) => setPage(p)}
                onChangeRowsPerPage={(e) => {
                    setPage(0)
                    setRows(Number(e.target.value))
                }}
                // @ts-ignore
                ActionsComponent={TablePaginationActions}
            />
        </TableRow>
        {!valid && showValidity ? <TableRow>
            <TableCell
                colSpan={colSize + 1}
            >
                <ValidityHelperText
                    /*
                     * only pass down errors which are not for a specific sub-schema
                     * todo: check if all needed are passed down
                     */
                    errors={errors}
                    showValidity={showValidity}
                    schema={schema}
                />
            </TableCell>
        </TableRow> : null}
    </MuiTableFooter>
}

// @ts-ignore
TableFooter = memo(TableFooter)

export { TableFooter }
