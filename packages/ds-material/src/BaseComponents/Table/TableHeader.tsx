import React from 'react'
import { List, Map } from 'immutable'
import { OwnKey, TransTitle } from '@ui-schema/ui-schema'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { TableHeaderProps } from '@ui-schema/ds-material/BaseComponents/Table/TableTypes'

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
        itemsSchema.get('type') === 'object' &&
        itemsSchema.getIn(['rowSortOrder'])?.size
    ) {
        cellSchema = itemsSchema.getIn(['rowSortOrder'])
            // @ts-ignore
            .map((key: OwnKey) => cellSchema.get(key))
    }
    return <TableHead>
        {validItemSchema ?
            <TableRow>
                {cellSchema.map((item, j) =>
                    !item.get('hidden') ? <TableCell key={j}>
                        <div id={'uis-' + uid + '-tbl-' + j}>
                            <TransTitle
                                schema={item}
                                storeKeys={storeKeys.push(j as OwnKey)}
                                ownKey={j as OwnKey}
                            />
                            {!schema.getIn(['view', 'hideItemsTitle']) &&
                            item.get('type') === 'object' ?
                                <div>
                                    {' ('}
                                    {item.get('properties')?.keySeq()
                                        .map((key: string, i: number) => <React.Fragment key={key}>
                                            <TransTitle
                                                schema={item.getIn(['properties', key])}
                                                storeKeys={storeKeys.push(j as number).push(key)}
                                                ownKey={key}
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
