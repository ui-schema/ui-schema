import React from 'react'
import { StoreKeyType, WithValue } from '@ui-schema/react/UIStore'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { memo } from '@ui-schema/react/Utils/memo'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { SchemaTypesType } from '@ui-schema/ui-schema/CommonTypings'
import { schemaTypeToDistinct } from '@ui-schema/ui-schema/schemaTypeToDistinct'
import { List, OrderedMap, Map } from 'immutable'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { TableRowProps, TableRowActionDelete } from '@ui-schema/ds-material/BaseComponents/Table'
import { TableCellSchemaImmutable } from '@ui-schema/ds-material/Widgets/Table'
import { useTheme, Theme } from '@mui/material/styles'
import { SxProps } from '@mui/system'

const useStyles = (theme: Theme, {dense}: { dense: boolean }): SxProps => ({
    padding:
        dense ?
            `${theme.spacing(0)} ${theme.spacing(0.5)}` :
            `${theme.spacing(1)} ${theme.spacing(1.5)}`,
    overflow: 'hidden',
})

const WidgetEngineMemo = memo(WidgetEngine)

export const TableRowRenderer: React.ComponentType<WidgetProps & TableRowProps & Pick<WithValue, 'onChange'>> = (
    {
        parentSchema, schema,
        showValidity, widgets,
        storeKeys,
        uid,
        onChange, required,
        dense,
        setPage,
        showRows,
    },
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
            .forEach((key: StoreKeyType) => {
                orderedCellSchema = orderedCellSchema.set(key, cellSchema.get(key as number))
            })
        // @ts-ignore
        cellSchema = orderedCellSchema
    }

    const GroupRenderer = widgets.GroupRenderer

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
                    align={schemaTypeToDistinct(item.get('type')) === 'boolean' ? 'center' : undefined}
                >
                    {schemaTypeToDistinct(item.get('type')) === 'object' ?
                        <GroupRenderer schema={item} storeKeys={storeKeys}>
                            <WidgetEngineMemo<{ [k: string]: any } & WidgetProps>
                                showValidity={showValidity}
                                storeKeys={storeKeys.push(j as StoreKeyType)}
                                schema={item.setIn(['view', 'hideTitle'], true)}
                                parentSchema={schema}
                                readOnly={readOnly}

                                // overwriting `widgets`, needs to be passed down further on depending on use cases:
                                widgets={widgets}

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
                            widgets={widgets}

                            // custom table field prop for a11y labelling
                            // todo: `j` is correct for lists, as it mimics the tuple part
                            //       for Maps, this must be the property name
                            labelledBy={'uis-' + uid + '-tbl-' + j}
                        />}
                </TableCell>,
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
