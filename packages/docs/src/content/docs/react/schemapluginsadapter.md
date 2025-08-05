---
docModule:
    package: '@ui-schema/react'
    modulePath: "react/src/"
    fromPath: "SchemaPluginsAdapter"
    files:
        - "SchemaPluginsAdapter/*"
---

# SchemaPluginsAdapter

A [widget plugin](/docs/react/plugins) which runs [schema plugins](/docs/core/schemapluginstack) and connects to the [SchemaResourceProvider](/docs/react/schemaresource).

```typescript
import { schemaPluginsAdapterBuilder } from '@ui-schema/react/SchemaPluginsAdapter'

const customBinding = {
    ...bindingComponents,
    widgetPlugins: [
        schemaPluginsAdapterBuilder([
            validatorPlugin,
            // add any schemaPlugin, in order they should be run
        ]),
    ],
}
```
