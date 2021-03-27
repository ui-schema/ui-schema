# DS Material

Base components for the `Table` widget, to build custom table widgets, check the [widget docs here](/docs/widgets/Table).

> 🚧 Work in progress, experimental [#73](https://github.com/ui-schema/ui-schema/issues/73)

```typescript jsx
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
```
