# DS Material Table

Base components for the `Table` widget, to build custom table widgets, check the [widget docs here](/docs/widgets/Table).

> 🚧 Work in progress, experimental [#73](https://github.com/ui-schema/ui-schema/issues/73)

```typescript jsx
import React from 'react'
import { memo, WidgetProps } from '@ui-schema/ui-schema'
import { TableRenderer, TableFooter, TableHeader, TableRowRenderer } from '@ui-schema/ds-material/BaseComponents/Table'

const TableHeaderMemo = memo(TableHeader)
const TableRowRendererMemo = memo(TableRowRenderer)

export const Table: React.ComponentType<WidgetProps> = (props) => {
    return <TableRenderer
        {...props}
        TableRowRenderer={TableRowRendererMemo}
        TableFooter={TableFooter}
        TableHeader={TableHeaderMemo}
    />
}
```
