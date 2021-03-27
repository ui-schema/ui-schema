import React from 'react'
import { memo, WidgetProps } from '@ui-schema/ui-schema'
import { TableRenderer } from '@ui-schema/ds-material/BaseComponents/Table/TableRenderer'
import { TableFooter } from '@ui-schema/ds-material/BaseComponents/Table/TableFooter'
import { TableHeader } from '@ui-schema/ds-material/BaseComponents/Table/TableHeader'
import { TableRowRenderer } from '@ui-schema/ds-material/BaseComponents/Table/TableRowRenderer'

const TableHeaderMemo = memo(TableHeader)

export const Table: React.ComponentType<WidgetProps> = (props) => {
    return <TableRenderer
        {...props}
        TableRowRenderer={TableRowRenderer}
        TableFooter={TableFooter}
        TableHeader={TableHeaderMemo}
    />
}
