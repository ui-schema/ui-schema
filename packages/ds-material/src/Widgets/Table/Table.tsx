import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'
import { TransTitle, extractValue, memo, PluginStack, Trans, WidgetProps, WithValue } from '@ui-schema/ui-schema'
import { ValidityHelperText } from '../../Component/LocaleHelperText/LocaleHelperText'
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
}

const useTableRowStyle = makeStyles<Theme, { dense: boolean }>((theme) => ({
    cell: {
        padding: ({dense}) =>
            dense ? `${theme.spacing(0)}px ${theme.spacing(0.5)}px` :
                `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
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
                    <PluginStack
                        showValidity={showValidity}
                        storeKeys={ownKeys.push(j as number)}
                        schema={item.setIn(['view', 'hideTitle'], true)}
                        parentSchema={schema}
                        level={level + 1}
                        readOnly={readOnly}
                        noGrid
                        widgets={widgets}
                    />
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
                        ({value, internal}) => ({
                            value: value.splice(index, 1),
                            internal: internal.splice(index, 1),
                        }),
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
        showValidity, errors, required, level,
        // widgets must come from an own wrapper component, to overwrite/enable any widgets for special `TableCell` formatting
        widgets,
    }
) => {
    const btnSize = schema.getIn(['view', 'btnSize']) || 'small'
    const dense = schema.getIn(['view', 'dense']) || false
    const itemsSchema = schema.get('items')
    const readOnly = schema.get('readOnly')

    return <>
        {!schema.getIn(['view', 'hideTitle']) ?
            <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
            : null}

        <TableContainer>
            <MuiTable size={dense ? 'small' : 'medium'}>
                <TableHead>
                    {itemsSchema && Map.isMap(itemsSchema) ?
                        <TableRow>
                            {((itemsSchema as Map<'items', List<any>>)
                                .get('items') as List<any>)
                                .map((item, j) =>
                                    <TableCell key={j}>
                                        <TransTitle
                                            schema={item}
                                            storeKeys={storeKeys.push(j as number)}
                                            ownKey={j as number}
                                        />
                                    </TableCell>
                                ).valueSeq()}
                            {!readOnly ? <TableCell/> : null}
                        </TableRow>
                        : null}
                </TableHead>
                <TableBody>
                    {itemsSchema && Map.isMap(itemsSchema) && list ?
                        list.map((_val: any, i: number) =>
                            <TableRowRenderer
                                key={i} index={i} listSize={list.size}
                                storeKeys={storeKeys}
                                dense={dense}
                                schema={schema} onChange={onChange}
                                showValidity={showValidity}
                                deleteOnEmpty={(schema.get('deleteOnEmpty') as boolean) || required}
                                level={level}
                                widgets={widgets}
                            />
                        ).valueSeq() : null}
                </TableBody>
            </MuiTable>
        </TableContainer>

        {!readOnly ?
            <IconButton
                onClick={() => {
                    onChange(
                        storeKeys, ['value', 'internal'],
                        ({value = List(), internal = List()}) => ({
                            value: value.push(schema.getIn(['items', 'type']) === 'object' ? Map() : List()),
                            internal: internal.push(schema.getIn(['items', 'type']) === 'object' ? Map() : List()),
                        })
                    )
                }}
                size={btnSize}
                style={{marginTop: 6}}
            >
                {/* @ts-ignore */}
                <AccessTooltipIcon title={<Trans text={'labels.add-row'}/>}>
                    <Add fontSize={'inherit'}/>
                </AccessTooltipIcon>
            </IconButton> : null}

        <ValidityHelperText
            /*
             * only pass down errors which are not for a specific sub-schema
             * todo: check if all needed are passed down
             */
            errors={errors}
            showValidity={showValidity}
            schema={schema}
        />
    </>
}

Table = extractValue(memo(Table))

export { Table }
