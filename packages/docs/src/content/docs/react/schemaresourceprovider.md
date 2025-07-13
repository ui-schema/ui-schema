---
docModule:
    package: '@ui-schema/react'
    modulePath: "react/src/"
    fromPath: "SchemaResourceProvider"
    files:
        - "SchemaResourceProvider/*"
---

# Schema Resource Provider

Provider for the [schema resource system](/docs/core/schemaresource).

Basic usage:

```tsx
import { useMemo } from 'react'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { SchemaResourceProvider } from '@ui-schema/react/SchemaResourceProvider'
import { resourceFromSchema } from '@ui-schema/ui-schema/SchemaResource'

const schema = createOrderedMap({
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
    },
    required: ['name'],
})

const Form = () => {
    const resource = useMemo(() => resourceFromSchema(schema, {}), [])

    // use collected information to load missing sub-schema or show errors
    // resource.unresolved

    return <SchemaResourceProvider
        resource={resource}
    >
        <WidgetEngine
            isRoot
            // pass down the prepared schema, not the original!
            // the root branch value is the root schema.
            schema={resource.branch.value()}
        />
    </SchemaResourceProvider>
}
```
