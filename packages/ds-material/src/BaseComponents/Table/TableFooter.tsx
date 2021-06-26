import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Add from '@material-ui/icons/Add'
import { memo, Trans, WidgetProps } from '@ui-schema/ui-schema'
import { ValidityHelperText } from '../../Component/LocaleHelperText/LocaleHelperText'
import { List, Map } from 'immutable'
import { AccessTooltipIcon } from '../../Component/Tooltip/Tooltip'
import TablePagination from '@material-ui/core/TablePagination'
import MuiTableFooter from '@material-ui/core/TableFooter'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { TablePaginationActions } from '@ui-schema/ds-material/BaseComponents/Table/TablePaginationActions'
import { TableFooterProps } from '@ui-schema/ds-material/BaseComponents/Table/TableTypes'
import { withTable } from '@ui-schema/ds-material/BaseComponents/Table/TableContext'

export interface TableFooterErrorsBaseProps {
    colSize: number | undefined
    showValidity: WidgetProps['showValidity']
    schema: WidgetProps['schema']
}

export const TableFooterErrorsBase: React.ComponentType<TableFooterErrorsBaseProps & { valid: boolean, errors: WidgetProps['errors'] }> = (
    {
        colSize = 0,
        showValidity,
        schema,
        valid, errors,
    }
) => {
    return !valid && showValidity ? <TableRow>
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
    </TableRow> : null
}

export const TableFooterBase: React.ComponentType<TableFooterProps> = (
    {
        t,
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
        showValidity,
        rowsPerPage, rowsShowAll,
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
                            if (rows !== -1) {
                                setPage(Number(Math.ceil((listSizeCurrent + 1) / rows)) - 1)
                            }
                            onChange(
                                storeKeys, ['value', 'internal'],
                                ({value = List(), internal = List()}) => ({
                                    value: value.push(schema.getIn(['items', 'type']) === 'object' ? Map() : List()),
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
            </TableCell>

            <TablePagination
                //rowsPerPageOptions={[5, 10, 25, 50, {label: t('pagination.all') as string, value: -1}]}
                rowsPerPageOptions={
                    rowsShowAll ?
                        rowsPerPage.push({label: t ? t('pagination.all') as string : 'all', value: -1}).toArray() :
                        rowsPerPage.toArray()
                }
                colSpan={colSize + 1}
                count={listSize || 0}
                rowsPerPage={rows}
                page={page}
                SelectProps={{
                    inputProps: {'aria-label': t ? t('pagination.rows-per-page') as string : 'per Page'},
                    //native: true,
                }}
                onChangePage={(_e, p) => setPage(p)}
                onChangeRowsPerPage={(e) => {
                    setPage(0)
                    setRows(Number(e.target.value))
                }}
                // @ts-ignore
                ActionsComponent={TablePaginationActions}
                labelRowsPerPage={t ? t('pagination.rows-per-page') as string + ':' : undefined}
                labelDisplayedRows={({from, to, count}) => `${to !== -1 ? (from + '-' + to) : count} ${t ? t('pagination.of') as string : 'of'} ${count !== -1 ? count : 0}`}
            />
        </TableRow>
        <TableFooterErrors colSize={colSize} showValidity={showValidity} schema={schema}/>
    </MuiTableFooter>
}
export const TableFooterErrors: React.ComponentType<TableFooterErrorsBaseProps> = withTable<TableFooterErrorsBaseProps>(memo(TableFooterErrorsBase))

export const TableFooter: React.ComponentType<TableFooterProps> = memo(TableFooterBase)
