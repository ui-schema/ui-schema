import React from 'react'
import { memo, OwnKey, PluginStack, StoreKeys, WidgetProps } from '@ui-schema/ui-schema'
import { List, OrderedMap, Map } from 'immutable'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { TableRowProps } from '@ui-schema/ds-material/BaseComponents/Table/TableTypes'
import { TableRowActionDelete } from '@ui-schema/ds-material/BaseComponents/Table/TableRowActionDelete'

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

let TableRowRenderer: React.ComponentType<WidgetProps & TableRowProps> = (
    {
        parentSchema, schema,
        showValidity, widgets,
        storeKeys, ownKey,
        level,
        uid,
        onChange, required,
        dense,
        setPage,
        showRows,
    }
) => {
    const classes = useTableRowStyle({dense})
    // only supporting array tuple schemas or objects for table rows / items
    let cellSchema = (schema.get('items') as List<any>) || (schema.get('properties') as Map<string, any>)
    const readOnly = parentSchema.get('readOnly')
    const deleteOnEmpty = parentSchema.get('deleteOnEmpty') || required

    if (
        schema.get('type') === 'object' &&
        schema.getIn(['rowSortOrder'])?.size
    ) {
        let orderedCellSchema = OrderedMap()
        schema.getIn(['rowSortOrder'])
            // @ts-ignore
            .forEach((key: OwnKey) => {
                orderedCellSchema = orderedCellSchema.set(key, cellSchema.get(key as number))
            })
        // @ts-ignore
        cellSchema = orderedCellSchema
    }

    const GroupRenderer = widgets.GroupRenderer

    return <TableRow>
        {cellSchema.map((item, j) =>
            item.get('hidden') === true ?
                <PluginStack
                    key={j}
                    storeKeys={storeKeys.push(j as OwnKey)}
                    schema={item}
                    parentSchema={parentSchema}
                    level={level + 1}
                    isVirtual
                /> :
                <TableCell
                    key={j}
                    className={classes.cell}
                >
                    {item.get('type') === 'object' ?
                        <GroupRenderer level={0} schema={item} className={classes.groupRenderer}>
                            <PluginStack
                                showValidity={showValidity}
                                storeKeys={storeKeys.push(j as OwnKey)}
                                schema={item.setIn(['view', 'hideTitle'], true)}
                                parentSchema={parentSchema}
                                level={level + 1}
                                readOnly={readOnly}

                                // overwriting `widgets`, needs to be passed down further on depending on use cases:
                                widgets={widgets}

                                // table field a11y labelling not supported for object,
                                // must be done by in-cell translation
                                // labelledBy={'uis-' + uid + '-tbl-' + j}
                            />
                        </GroupRenderer> :
                        <PluginStack
                            showValidity={showValidity}
                            storeKeys={storeKeys.push(j as OwnKey)}
                            schema={item.setIn(['view', 'hideTitle'], true)}
                            parentSchema={parentSchema}
                            level={level + 1}
                            readOnly={readOnly}
                            noGrid

                            // overwriting `widgets`, needs to be passed down further on depending on use cases:
                            widgets={widgets}

                            // custom table field prop for a11y labelling
                            // todo: `j` is correct for lists, as it mimics the tuple part
                            //       for Maps, this must be the property name
                            labelledBy={'uis-' + uid + '-tbl-' + j}
                        />}
                </TableCell>
        ).valueSeq()}

        {!readOnly ? <TableCell className={classes.cell}>
            <TableRowActionDelete
                storeKeys={storeKeys.slice(storeKeys.size - 1, 1) as StoreKeys}
                onChange={onChange}
                setPage={setPage}
                index={ownKey as number}
                deleteOnEmpty={deleteOnEmpty as boolean}
                showRows={showRows}
            />
        </TableCell> : null}
    </TableRow>
}
TableRowRenderer = memo(TableRowRenderer)

export { TableRowRenderer }
