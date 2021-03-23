import React from 'react'
import { useUID } from 'react-uid'
import IconButton from '@material-ui/core/IconButton'
import Delete from '@material-ui/icons/Delete'
import { TransTitle, extractValue, memo, PluginStack, Trans, WidgetProps, WithValue, useImmutable, StoreSchemaType } from '@ui-schema/ui-schema'
import { List, Map } from 'immutable'
import { AccessTooltipIcon } from '../../Component/Tooltip/Tooltip'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import MuiTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { TableFooter } from '@ui-schema/ds-material/Widgets/Table/TableFooter'

export interface TableRowProps {
    index: number
    listSize: number
    schema: WidgetProps['schema']
    deleteOnEmpty: boolean
    dense: boolean
    showValidity: WidgetProps['showValidity']
    onChange: WidgetProps['onChange']
    storeKeys: WidgetProps['storeKeys']
    level: WidgetProps['level']
    widgets: WidgetProps['widgets']
    setPage: React.Dispatch<React.SetStateAction<number>>
    showRows: number
}

const useTableRowStyle = makeStyles<Theme, { dense: boolean }>((theme) => ({
    cell: {
        padding: ({dense}) =>
            dense ? `${theme.spacing(0)}px ${theme.spacing(0.5)}px` :
                `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
        overflow: 'hidden',
    },
    groupRenderer: {
        /*padding: ({dense}) =>
            dense ? `${theme.spacing(1)}px ${theme.spacing(0.5)}px` :
                `${theme.spacing(1.5)}px ${theme.spacing(1)}px`,*/
    },
}))

// @ts-ignore
let TableRowRenderer: React.ComponentType<TableRowProps> = (
    {
        index, onChange, deleteOnEmpty,
        schema,
        showValidity, widgets,
        storeKeys,
        level,
        dense,
        setPage,
        showRows,
    }
) => {
    const classes = useTableRowStyle({dense})
    const ownKeys = storeKeys.push(index)
    const itemsSchema = schema.get('items')
    const readOnly = schema.get('readOnly')

    // only supporting tuple schemas for tables
    return <TableRow>
        {((itemsSchema as Map<'items', List<any>>)
            .get('items') as List<any>)
            .map((item, j) =>
                <TableCell
                    key={j}
                    className={classes.cell}
                >
                    {item.get('type') === 'object' ?
                        <widgets.GroupRenderer level={0} schema={item} className={classes.groupRenderer}>
                            <PluginStack
                                showValidity={showValidity}
                                storeKeys={ownKeys.push(j as number)}
                                schema={item.setIn(['view', 'hideTitle'], true)}
                                parentSchema={schema}
                                level={level + 1}
                                readOnly={readOnly}
                                //noGrid
                                widgets={widgets}
                            />
                        </widgets.GroupRenderer> :
                        <PluginStack
                            showValidity={showValidity}
                            storeKeys={ownKeys.push(j as number)}
                            schema={item.setIn(['view', 'hideTitle'], true)}
                            parentSchema={schema}
                            level={level + 1}
                            readOnly={readOnly}
                            //noGrid
                            widgets={widgets}
                        />}
                </TableCell>
            ).valueSeq()}
        {!readOnly ? <TableCell
            className={classes.cell}
        >
            <IconButton
                color="inherit"
                onClick={() => {
                    onChange(
                        storeKeys, ['value', 'internal'],
                        ({value, internal}) => {
                            setPage((Math.ceil((value.size - 1) / showRows) || 1) - 1)
                            return ({
                                value: value.splice(index, 1),
                                internal: internal.splice(index, 1),
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
        </TableCell> : null}
    </TableRow>
}
TableRowRenderer = memo(TableRowRenderer)

let Table: React.ComponentType<WidgetProps & WithValue> = (
    {
        storeKeys, ownKey, schema, value: list, onChange,
        showValidity, valid, errors, required, level,
        // widgets must come from an own wrapper component, to overwrite/enable any widgets for special `TableCell` formatting
        widgets,
    }
) => {
    const uid = useUID()
    const [page, setPage] = React.useState(0)
    const [rows, setRows] = React.useState(5)
    const [filteredList, setFilteredList] = React.useState<List<any> | undefined>(undefined)
    const currentList = useImmutable(list)
    const btnSize = schema.getIn(['view', 'btnSize']) || 'small'
    const dense = schema.getIn(['view', 'dense']) || false
    const itemsSchema = schema.get('items') as StoreSchemaType
    const readOnly = schema.get('readOnly') as boolean

    React.useEffect(() => {
        setFilteredList(() => {
            //return currentList?.slice(page * rows, (page * rows) + rows)
            return currentList
        })
    }, [page, rows, setFilteredList, currentList])

    const validItemSchema = itemsSchema && Map.isMap(itemsSchema) && itemsSchema.get('type') === 'array'

    return <>
        {!schema.getIn(['view', 'hideTitle']) ?
            <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
            : null}

        <TableContainer>
            <MuiTable size={dense ? 'small' : 'medium'}>
                <TableHead>
                    {validItemSchema ?
                        <TableRow>
                            {((itemsSchema as Map<'items', List<any>>)
                                .get('items') as List<any>)
                                .map((item, j) =>
                                    <TableCell key={j}>
                                        <div id={'_uid-' + uid + '-tbl-' + storeKeys.join('.')}>
                                            <TransTitle
                                                schema={item}
                                                storeKeys={storeKeys.push(j as number)}
                                                ownKey={j as number}
                                            />
                                        </div>
                                        {item.get('type') === 'object' ?
                                            <TableContainer>
                                                <MuiTable size={dense ? 'small' : 'medium'}>
                                                    <TableHead>
                                                        <TableRow>
                                                            {item.get('properties')?.keySeq()
                                                                .map((key: string) => <TableCell key={key}>
                                                                    <div id={'_uid-' + uid + '-tbl-' + storeKeys.join('.')}>
                                                                        <TransTitle
                                                                            schema={item.getIn(['properties', key])}
                                                                            storeKeys={storeKeys.push(j as number).push(key)}
                                                                            ownKey={key}
                                                                        />
                                                                    </div>
                                                                </TableCell>).valueSeq()}
                                                        </TableRow>
                                                    </TableHead>
                                                </MuiTable>
                                            </TableContainer>
                                            : null}
                                    </TableCell>
                                ).valueSeq()}
                            {!readOnly ? <TableCell/> : null}
                        </TableRow>
                        : null}
                </TableHead>
                <TableBody>
                    {validItemSchema && filteredList ? <React.Fragment>
                        {filteredList
                            .slice(0, (page * rows))
                            .map((_val: any, i) =>
                                <PluginStack
                                    key={i as number}
                                    storeKeys={storeKeys.push(i as number)}
                                    schema={itemsSchema}
                                    parentSchema={schema}
                                    level={0}
                                    isVirtual
                                />
                            ).valueSeq()}
                        {filteredList
                            .slice(page * rows, (page * rows) + rows)
                            .map((_val: any, i) =>
                                // todo: actually, the `TableRow` must also be rendered by `PluginStack`, as needing `array` validation
                                <TableRowRenderer
                                    setPage={setPage}
                                    showRows={rows}
                                    key={(i as number) + (page * rows)}
                                    index={(i as number) + (page * rows)}
                                    listSize={list.size}
                                    storeKeys={storeKeys}
                                    dense={dense}
                                    schema={schema} onChange={onChange}
                                    showValidity={showValidity}
                                    deleteOnEmpty={(schema.get('deleteOnEmpty') as boolean) || required}
                                    level={level}
                                    widgets={widgets}
                                />
                            ).valueSeq()}
                        {filteredList
                            .slice((page * rows) + rows, filteredList.size)
                            .map((_val: any, i) =>
                                <PluginStack
                                    key={i}
                                    storeKeys={storeKeys.push((i as number) + (page * rows) + rows)}
                                    schema={itemsSchema}
                                    parentSchema={schema}
                                    level={0}
                                    isVirtual
                                />
                            ).valueSeq()}
                    </React.Fragment> : null}
                </TableBody>
                <TableFooter
                    colSize={((itemsSchema as Map<'items', List<any>>)
                        .get('items') as List<any>)?.size || 0}
                    listSize={list?.size}
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

Table = extractValue(memo(Table))

export { Table }
