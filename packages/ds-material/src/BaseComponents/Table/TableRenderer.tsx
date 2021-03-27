import React from 'react'
import { useUID } from 'react-uid'
import { TransTitle, extractValue, memo, PluginStack, WidgetProps, WithValue, useImmutable, StoreSchemaType, useUIMeta } from '@ui-schema/ui-schema'
import { List, Map, OrderedMap } from 'immutable'
import MuiTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableContainer from '@material-ui/core/TableContainer'
import { TableRendererBaseProps, TableValue } from '@ui-schema/ds-material/BaseComponents/Table/TableTypes'

export const TableRendererBase: React.ComponentType<WidgetProps & WithValue & TableRendererBaseProps> = (
    {
        storeKeys, ownKey, schema, value, onChange,
        showValidity, valid, errors, level,
        // widgets must come from an own wrapper component, to overwrite/enable any widgets for special `TableCell` formatting
        widgets,
        TableRowRenderer,
        TableFooter,
        TableHeader,
    }
) => {
    //console.log(storeKeys.toJS(), errors?.toJS())
    const uid = useUID()
    const {t} = useUIMeta()
    const [page, setPage] = React.useState(0)
    const [rows, setRows] = React.useState(5)
    const [filteredList, setFilteredList] = React.useState<TableValue | undefined>(undefined)
    const currentList: TableValue = useImmutable(value)
    const btnSize = schema.getIn(['view', 'btnSize']) || 'small'
    const dense = schema.getIn(['view', 'dense']) || false
    const itemsSchema = schema.get('items') as StoreSchemaType
    const readOnly = schema.get('readOnly') as boolean

    React.useEffect(() => {
        setFilteredList(() => {
            return currentList
        })
    }, [page, rows, setFilteredList, currentList])

    const currentRows = rows === -1 ? currentList?.size || 0 : rows
    const filteredRows = rows === -1 ? filteredList?.size || 0 : rows
    const filteredRowsStartVisible = page * filteredRows

    const validItemSchema = itemsSchema && Map.isMap(itemsSchema) &&
        (itemsSchema.get('type') === 'array' || itemsSchema.get('type') === 'object')

    if (process.env.NODE_ENV === 'development' && !validItemSchema) {
        console.error('TableRenderer invalid `items` schema at storeKeys:', storeKeys?.toJS(), itemsSchema.toJS())
    }

    const visibleCols = (
        (itemsSchema.get('items') as List<any>)?.filter(p => !p.get('hidden')) ||
        (itemsSchema.get('properties') as OrderedMap<string, any>)?.filter(p => !p.get('hidden')).keySeq()
    )

    return <>
        {!schema.getIn(['view', 'hideTitle']) ?
            <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
            : null}

        <TableContainer>
            <MuiTable size={dense ? 'small' : 'medium'}>
                <TableHeader
                    uid={uid}
                    validItemSchema={validItemSchema}
                    itemsSchema={itemsSchema}
                    schema={schema}
                    storeKeys={storeKeys}
                    dense={dense}
                    readOnly={readOnly}
                />

                <TableBody>
                    {validItemSchema && filteredList ? <React.Fragment>
                        {filteredList
                            .map((_val: any, i) =>
                                <PluginStack
                                    key={i}
                                    storeKeys={storeKeys.push(i as number)}
                                    schema={itemsSchema}
                                    parentSchema={schema}
                                    level={level}
                                    isVirtual={(i as number) < filteredRowsStartVisible || (i as number) >= (filteredRowsStartVisible + currentRows)}
                                    noGrid

                                    widgets={widgets}
                                    WidgetOverride={TableRowRenderer}
                                    setPage={setPage}
                                    showRows={rows}
                                    uid={uid}
                                    listSize={value.size}
                                    dense={dense}
                                />
                            ).valueSeq()}
                    </React.Fragment> : null}
                </TableBody>
                <TableFooter
                    colSize={
                        visibleCols?.size || 0
                    }
                    t={t}
                    listSize={value?.size}
                    listSizeCurrent={currentList?.size || 0}
                    btnSize={btnSize}
                    schema={schema}
                    setPage={setPage}
                    page={page}
                    setRows={setRows}
                    rows={rows}
                    storeKeys={storeKeys}
                    errors={errors}
                    showValidity={showValidity}
                    valid={valid}
                    onChange={onChange}
                    dense={dense}
                    readOnly={readOnly}
                />
            </MuiTable>
        </TableContainer>
    </>
}

export const TableRenderer = extractValue(memo(TableRendererBase))
