import React from 'react'
import { List } from 'immutable'
import { memo, WidgetProps } from '@ui-schema/ui-schema'
import { TableRenderer } from '@ui-schema/ds-material/BaseComponents/Table/TableRenderer'
import { TableFooter } from '@ui-schema/ds-material/BaseComponents/Table/TableFooter'
import { TableHeader } from '@ui-schema/ds-material/BaseComponents/Table/TableHeader'
import { TableRowRenderer } from '@ui-schema/ds-material/BaseComponents/Table/TableRowRenderer'

const TableHeaderMemo = memo(TableHeader)
const TableRowRendererMemo = memo(TableRowRenderer)

const rowsPerPageDefault = List([5, 10, 25])

export const Table: React.ComponentType<WidgetProps> = (props) => {
    return <TableRenderer
        {...props}
        TableRowRenderer={TableRowRendererMemo}
        TableFooter={TableFooter}
        TableHeader={TableHeaderMemo}
        rowsPerPage={props.schema.getIn(['view', 'rowsPerPage']) || rowsPerPageDefault}
        rowsShowAll={props.schema.getIn(['view', 'rowsShowAll'])}
    />
}
