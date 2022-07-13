import React from 'react'
import { List, Map } from 'immutable'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { StoreKeyType } from '@ui-schema/react/UIStore'
import { SchemaTypesType } from '@ui-schema/system/CommonTypings'
import { schemaTypeToDistinct } from '@ui-schema/system/schemaTypeToDistinct'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { TableHeaderProps } from '@ui-schema/ds-material/BaseComponents/Table/TableTypes'
import { TableCellSchemaImmutable } from '@ui-schema/ds-material/Widgets/Table/TableSchema'

export const TableHeader: React.ComponentType<TableHeaderProps> = (
    {
        schema,
        validItemSchema,
        uid,
        itemsSchema,
        storeKeys,
        readOnly,
    }
) => {
    let cellSchema = (itemsSchema.get('items') as List<any>) || (itemsSchema.get('properties') as Map<string, any>)
    if (
        schemaTypeToDistinct(itemsSchema.get('type') as SchemaTypesType) === 'object' &&
        (itemsSchema.getIn(['rowSortOrder']) as TableCellSchemaImmutable['rowSortOrder'])?.size
    ) {
        cellSchema = (itemsSchema.getIn(['rowSortOrder']) as TableCellSchemaImmutable['rowSortOrder'])
            // @ts-ignore
            .map((key: StoreKeyType) => cellSchema.get(key))
    }
    return <TableHead>
        {validItemSchema ?
            <TableRow>
                {cellSchema.map((item, j) =>
                    !item.get('hidden') ? <TableCell key={j}>
                        <div id={'uis-' + uid + '-tbl-' + j}>
                            <TranslateTitle
                                schema={item}
                                storeKeys={storeKeys.push(j as StoreKeyType)}
                            />
                            {!schema.getIn(['view', 'hideItemsTitle']) &&
                            schemaTypeToDistinct(item.get('type')) === 'object' ?
                                <div>
                                    {' ('}
                                    {item.get('properties')?.keySeq()
                                        .map((key: string, i: number) => <React.Fragment key={key}>
                                            <TranslateTitle
                                                schema={item.getIn(['properties', key])}
                                                storeKeys={storeKeys.push(j as number).push(key)}
                                            />
                                            {i < item.get('properties')?.keySeq().size - 1 ? ', ' : ''}
                                        </React.Fragment>).valueSeq()}
                                    {')'}
                                </div> : ''}
                        </div>
                    </TableCell> : null
                ).valueSeq()}
                {!readOnly ? <TableCell/> : null}
            </TableRow>
            : null}
    </TableHead>
}
