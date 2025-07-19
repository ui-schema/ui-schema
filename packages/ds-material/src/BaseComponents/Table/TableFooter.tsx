import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import * as React from 'react'
import Add from '@mui/icons-material/Add'
import { Translate } from '@ui-schema/react/Translate'
import { memo } from '@ui-schema/react/Utils/memo'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import TablePagination from '@mui/material/TablePagination'
import MuiTableFooter from '@mui/material/TableFooter'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { TablePaginationActions, TableFooterProps, TableContextType, withTable } from '@ui-schema/ds-material/BaseComponents/Table'
import { Map } from 'immutable'
import { ListButton } from '@ui-schema/ds-material/Component'
import { IconButtonProps } from '@mui/material/IconButton'

export interface TableFooterErrorsBaseProps {
    colSize: number | undefined
    showValidity: boolean | undefined
    schema: UISchemaMap
}

export const TableFooterErrorsBase: React.ComponentType<TableFooterErrorsBaseProps & TableContextType> = (
    {
        colSize = 0,
        showValidity,
        schema,
        valid, errors,
    },
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
export const TableFooterErrors: React.ComponentType<TableFooterErrorsBaseProps> = withTable<TableFooterErrorsBaseProps>(memo(TableFooterErrorsBase))

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
        btnStyle, btnVariant, btnColor,
        btnShowLabel,
        colSize,
        showValidity,
        rowsPerPage, rowsShowAll,
        noFirstPageButton, noLastPageButton,
    },
) => {
    return <MuiTableFooter>
        <TableRow>
            <TableCell
                size={dense ? 'small' : 'medium'}
            >
                {!readOnly ?
                    <ListButton
                        onClick={() => {
                            if (rows !== -1) {
                                setPage(Number(Math.ceil((listSizeCurrent + 1) / rows)) - 1)
                            }
                            onChange({
                                storeKeys,
                                type: 'list-item-add',
                                schema,
                            })
                        }}
                        btnSize={btnSize}
                        btnVariant={btnVariant}
                        btnColor={btnColor}
                        showLabel={btnShowLabel}
                        style={btnStyle}
                        Icon={Add}
                        title={
                            <Translate
                                text={'labels.add-row'}
                                context={Map({actionLabels: schema.get('tableActionLabels')})}
                            />
                        }
                    /> : null}
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
                sx={{
                    // todo: move footer out of table, like in examples of mui
                    //       better overflow control and easier to customize
                    '& .MuiToolbar-root': {
                        overflow: 'auto',
                        scrollbarWidth: 'thin',
                    },
                }}
                /* eslint-disable-next-line @typescript-eslint/no-deprecated */
                SelectProps={{
                    inputProps: {'aria-label': t ? t('pagination.rows-per-page') as string : 'per Page'},
                    //native: true,
                }}
                onPageChange={(_e, p) => setPage(p)}
                onRowsPerPageChange={(e) => {
                    setPage(0)
                    setRows(Number(e.target.value))
                }}
                /* eslint-disable-next-line @typescript-eslint/no-deprecated */
                backIconButtonProps={{
                    size: btnSize,
                    // using these props as a wrapper - as otherwise not possible to pass down
                    noFirstPageButton: noFirstPageButton,
                } as unknown as IconButtonProps}
                /* eslint-disable-next-line @typescript-eslint/no-deprecated */
                nextIconButtonProps={{
                    size: btnSize,
                    style: {
                        padding: btnSize === 'small' ? 2 : undefined,
                    },
                    // using these props as a wrapper - as otherwise not possible to pass down
                    noLastPageButton: noLastPageButton,
                } as unknown as IconButtonProps}
                ActionsComponent={TablePaginationActions}
                labelRowsPerPage={t ? t('pagination.rows-per-page') as string + ':' : undefined}
                labelDisplayedRows={({from, to, count}) => `${to !== -1 ? (from + '-' + to) : count} ${t ? t('pagination.of') as string : 'of'} ${count !== -1 ? count : 0}`}
            />
        </TableRow>
        <TableFooterErrors colSize={colSize} showValidity={showValidity} schema={schema}/>
    </MuiTableFooter>
}
export const TableFooter: React.ComponentType<TableFooterProps> = memo(TableFooterBase)
