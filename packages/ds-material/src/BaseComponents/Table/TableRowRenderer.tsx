import React from 'react'
import { KeyType, memo, PluginStack, SchemaTypesType, schemaTypeToDistinct, WidgetProps, WithValue } from '@ui-schema/ui-schema'
import { List, OrderedMap, Map } from 'immutable'
import { Theme } from '@mui/material/styles/createTheme'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { TableRowProps } from '@ui-schema/ds-material/BaseComponents/Table/TableTypes'
import { TableRowActionDelete } from '@ui-schema/ds-material/BaseComponents/Table/TableRowActionDelete'
import { TableCellSchemaImmutable } from '@ui-schema/ds-material/Widgets/Table/TableSchema'
import { useTheme } from '@mui/material/styles'
import { SxProps } from '@mui/system'

const useStyles = (theme: Theme, {dense}: { dense: boolean }): SxProps => ({
    padding:
        dense ?
            `${theme.spacing(0)} ${theme.spacing(0.5)}` :
            `${theme.spacing(1)} ${theme.spacing(1.5)}`,
    overflow: 'hidden',
})

const PluginStackMemo = memo(PluginStack)

export const TableRowRenderer: React.ComponentType<WidgetProps & TableRowProps & Pick<WithValue, 'onChange'>> = (
    {
        parentSchema, schema,
        showValidity, widgets,
        storeKeys,
        level,
        uid,
        onChange, required,
        dense,
        setPage,
        showRows,
    }
) => {
    const theme = useTheme()
    const styles = useStyles(theme, {dense})
    // only supporting array tuple schemas or objects for table rows / items
    let cellSchema = (schema.get('items') as List<any>) || (schema.get('properties') as Map<string, any>)
    const readOnly = Boolean(parentSchema?.get('readOnly'))
    const deleteOnEmpty = parentSchema?.get('deleteOnEmpty') || required

    if (
        schemaTypeToDistinct(schema.get('type') as SchemaTypesType) === 'object' &&
        (schema.getIn(['rowSortOrder']) as TableCellSchemaImmutable['rowSortOrder'])?.size
    ) {
        let orderedCellSchema = OrderedMap();
        (schema.getIn(['rowSortOrder']) as TableCellSchemaImmutable['rowSortOrder'])
            .forEach((key: KeyType) => {
                orderedCellSchema = orderedCellSchema.set(key, cellSchema.get(key as number))
            })
        // @ts-ignore
        cellSchema = orderedCellSchema
    }

    const GroupRenderer = widgets.GroupRenderer

    return <TableRow>
        {cellSchema.map((item, j) =>
            item.get('hidden') === true ?
                <PluginStackMemo
                    key={j}
                    storeKeys={storeKeys.push(j as KeyType)}
                    schema={item}
                    parentSchema={parentSchema}
                    level={level + 1}
                    isVirtual
                /> :
                <TableCell
                    key={j}
                    sx={styles}
                    align={schemaTypeToDistinct(item.get('type')) === 'boolean' ? 'center' : undefined}
                >
                    {
                        schemaTypeToDistinct(item.get('type')) === 'object' ?
                            <GroupRenderer level={0} schema={item} storeKeys={storeKeys}>
                                <PluginStackMemo<{ [k: string]: any }>
                                    showValidity={showValidity}
                                    storeKeys={storeKeys.push(j as KeyType)}
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
                            <PluginStackMemo<{ [k: string]: any }>
                                showValidity={showValidity}
                                storeKeys={storeKeys.push(j as KeyType)}
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

        {!readOnly ?
            <TableCell sx={styles}>
                <TableRowActionDelete
                    storeKeys={storeKeys}
                    onChange={onChange}
                    setPage={setPage}
                    index={storeKeys.last() as number}
                    deleteOnEmpty={deleteOnEmpty as boolean}
                    showRows={showRows}
                    schema={parentSchema}
                />
            </TableCell> : null}
    </TableRow>
}
