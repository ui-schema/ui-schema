import React from 'react'
import { List } from 'immutable'
import { memo, WidgetProps } from '@ui-schema/ui-schema'
import { TableRenderer, TableFooter, TableHeader, TableRowRenderer, TableRendererExtractorProps } from '@ui-schema/ds-material/BaseComponents/Table'

const TableHeaderMemo = memo(TableHeader)
const TableRowRendererMemo = memo(TableRowRenderer)

const rowsPerPageDefault = List([5, 10, 25])

export const Table: React.FC<WidgetProps> = (props) => {
    return <TableRenderer
        {...props}
        TableRowRenderer={TableRowRendererMemo}
        TableFooter={TableFooter}
        TableHeader={TableHeaderMemo}
        rowsPerPage={(props.schema.getIn(['view', 'rowsPerPage']) as TableRendererExtractorProps['rowsPerPage']) || rowsPerPageDefault}
        rowsShowAll={props.schema.getIn(['view', 'rowsShowAll']) as TableRendererExtractorProps['rowsShowAll']}
    />
}
