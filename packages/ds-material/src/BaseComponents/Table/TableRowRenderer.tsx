import { schemaTypeIs } from '@ui-schema/ui-schema/schemaTypeIs'
import * as React from 'react'
import { StoreKeyType, WithOnChange } from '@ui-schema/react/UIStore'
import { WidgetProps } from '@ui-schema/react/Widget'
import { memo } from '@ui-schema/react/Utils/memo'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { List, OrderedMap, Map } from 'immutable'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { TableRowProps, TableRowActionDelete } from '@ui-schema/ds-material/BaseComponents/Table'
import { TableCellSchemaImmutable } from '@ui-schema/ds-material/Widgets/Table'
import { useTheme, Theme, SxProps } from '@mui/material/styles'

const useStyles = (theme: Theme, {dense}: { dense: boolean }): SxProps => ({
    padding:
        dense ?
            `${theme.spacing(0)} ${theme.spacing(0.5)}` :
            `${theme.spacing(1)} ${theme.spacing(1.5)}`,
    overflow: 'hidden',
})

const WidgetEngineMemo = memo(WidgetEngine)

export const TableRowRenderer: React.ComponentType<WidgetProps & TableRowProps & WithOnChange> = (
    {
        parentSchema, schema,
        showValidity, binding,
        storeKeys,
        uid,
        onChange,
        dense,
        setPage,
        showRows,
        requiredList,
    },
) => {
    const theme = useTheme()
    const styles = useStyles(theme, {dense})
    // todo: use schema, prepared from getFields, to support more values;
    //       create an mui specific util and use it in everywhere to get columns from schema
    //       - object: a cell per property
    //       - array-tuple: a cell per item
    //       - array: a cell for the array
    //       - any other: a cell for the schema
    // only supporting array tuple schemas or objects for table rows / items
    let cellSchema = (schema.get('prefixItems') as List<any>) || (List.isList(schema?.get('items')) ? (schema.get('items') as List<any>) : undefined) || (schema.get('properties') as Map<string, any>)
    const readOnly = Boolean(parentSchema?.get('readOnly'))
    const deleteOnEmpty = parentSchema?.get('deleteOnEmpty') || requiredList // || required // todo: why was required here? would be from the array/row, not the array it is contained in

    if (
        schemaTypeIs(schema.get('type') as SchemaTypesType, 'object') &&
        (schema.getIn(['rowSortOrder']) as TableCellSchemaImmutable['rowSortOrder'])?.size
    ) {
        let orderedCellSchema = OrderedMap();
        (schema.getIn(['rowSortOrder']) as TableCellSchemaImmutable['rowSortOrder'])
            .forEach((key: StoreKeyType) => {
                orderedCellSchema = orderedCellSchema.set(key, cellSchema.get(key as number))
            })
        // @ts-ignore
        cellSchema = orderedCellSchema
    }

    const GroupRenderer = binding?.GroupRenderer || React.Fragment

    return <TableRow>
        {cellSchema.map((item, j) =>
            item.get('hidden') === true ?
                <WidgetEngineMemo
                    key={j}
                    storeKeys={storeKeys.push(j as StoreKeyType)}
                    schema={item}
                    parentSchema={schema}
                    isVirtual
                /> :
                <TableCell
                    key={j}
                    sx={styles}
                    align={schemaTypeIs(item.get('type'), 'boolean') ? 'center' : undefined}
                >
                    {/* todo: happy-path issue, always using object and requires value-based decision otherwise */}
                    {schemaTypeIs(item.get('type'), 'object')/* || (!item.get('type') && Map.isMap(value))*/ ?
                        <GroupRenderer schema={item} storeKeys={storeKeys}>
                            <WidgetEngineMemo<{ [k: string]: any } & WidgetProps>
                                showValidity={showValidity}
                                storeKeys={storeKeys.push(j as StoreKeyType)}
                                schema={item.setIn(['view', 'hideTitle'], true)}
                                parentSchema={schema}
                                readOnly={readOnly}

                                // overwriting `widgets`, needs to be passed down further on depending on use cases:
                                binding={binding}

                                // table field a11y labelling not supported for object,
                                // must be done by in-cell translation
                                // labelledBy={'uis-' + uid + '-tbl-' + j}
                            />
                        </GroupRenderer> :
                        <WidgetEngineMemo<{ [k: string]: any } & WidgetProps>
                            showValidity={showValidity}
                            storeKeys={storeKeys.push(j as StoreKeyType)}
                            schema={item.setIn(['view', 'hideTitle'], true)}
                            parentSchema={schema}
                            readOnly={readOnly}
                            noGrid

                            // overwriting `widgets`, needs to be passed down further on depending on use cases:
                            binding={binding}

                            // custom table field prop for a11y labelling
                            // todo: `j` is correct for lists, as it mimics the tuple part
                            //       for Maps, this must be the property name
                            labelledBy={'uis-' + uid + '-tbl-' + j}
                        />}
                </TableCell>,
        ).valueSeq()}

        {!readOnly ?
            <TableCell sx={{...styles, width: '1px'}}>
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
