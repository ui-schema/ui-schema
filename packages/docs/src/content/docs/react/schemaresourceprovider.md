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
import { SchemaResourceProvider } from '@ui-schema/react/SchemaResourceProvider'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { resourceFromSchema, SchemaResource } from '@ui-schema/ui-schema/SchemaResource'
import { useMemo, useState } from 'react'

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
    const [knownResources] = useState<Record<string, SchemaResource>>({})

    const resource = useMemo(() => {
        // create the prepared schema-resource
        return resourceFromSchema(schema, {
            // supply prepared resources for resolving $ref which are not embedded in the same schema
            resources: knownResources,
        })
    }, [knownResources])

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
